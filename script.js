/**
 * MathCore - Intelligent Calculator Engine (Final Production Build)
 * Fully integrates 15 mathematical calculators with dynamic UI, Step-by-Step, Graphs, and Education.
 */

document.addEventListener('DOMContentLoaded', () => {

    let currentCalculator = null;
    let chartInstance = null;

    // View Containers
    const views = { dashboard: document.getElementById('dashboard-view'), workspace: document.getElementById('workspace-view') };
    
    // UI Elements
    const ui = {
        gridContainer: document.getElementById('calculator-grid-container'),
        calcIcon: document.getElementById('calc-icon'),
        calcTitle: document.getElementById('calc-title'),
        calcDesc: document.getElementById('calc-desc'),
        form: document.getElementById('calc-form'),
        resultsArea: document.getElementById('results-area'),
        logoBtn: document.getElementById('logo-btn'),
        backBtn: document.getElementById('back-to-dash'),
        calcBtn: document.getElementById('calculate-btn'),
        themeToggle: document.getElementById('theme-toggle'),
        graphCard: document.getElementById('graph-card')
    };

    // --- 1. System Config: 15 Calculators ---
    const calculatorsConfig = [
        {
            category: "Algebra",
            items: [
                { id: "linear", name: "Linear Equation", icon: "ph-trend-up", desc: "Solve equations of form ax + b = c", inputs: [{id:"a", label:"Coefficient a"}, {id:"b", label:"Constant b"}, {id:"c", label:"Result c"}] },
                { id: "quadratic", name: "Quadratic Equation", icon: "ph-parabola", desc: "Solve polynomials of form ax² + bx + c = 0", inputs: [{id:"a", label:"Coefficient A (x²)"}, {id:"b", label:"Coefficient B (x)"}, {id:"c", label:"Constant C"}] },
                { id: "percentage", name: "Percentage", icon: "ph-percent", desc: "Find P% of a value X", inputs: [{id:"p", label:"Percentage (P)"}, {id:"x", label:"Value (X)"}] },
                { id: "distance", name: "Distance Formula", icon: "ph-arrows-out-line-horizontal", desc: "Distance between two 2D points", inputs: [{id:"x1", label:"Point 1: x"}, {id:"y1", label:"Point 1: y"}, {id:"x2", label:"Point 2: x"}, {id:"y2", label:"Point 2: y"}] }
            ]
        },
        {
            category: "Geometry",
            items: [
                { id: "circle-area", name: "Circle Area", icon: "ph-circle", desc: "Calculate area using radius", inputs: [{id:"r", label:"Radius (r)"}] },
                { id: "rectangle-area", name: "Rectangle Area", icon: "ph-rectangle", desc: "Calculate area of a rectangle", inputs: [{id:"l", label:"Length (l)"}, {id:"w", label:"Width (w)"}] },
                { id: "cylinder-volume", name: "Cylinder Volume", icon: "ph-cylinder", desc: "Volume of a cylinder", inputs: [{id:"r", label:"Radius (r)"}, {id:"h", label:"Height (h)"}] },
                { id: "sphere-volume", name: "Sphere Volume", icon: "ph-sphere", desc: "Volume of a perfect sphere", inputs: [{id:"r", label:"Radius (r)"}] },
                { id: "pythagorean", name: "Pythagorean Theorem", icon: "ph-line-segments", desc: "Find hypotenuse (c) from sides (a, b)", inputs: [{id:"a", label:"Side a"}, {id:"b", label:"Side b"}] }
            ]
        },
        {
            category: "Trigonometry",
            items: [
                { id: "sine", name: "Sine Calculator", icon: "ph-wave-sine", desc: "Calculate sine of an angle (degrees)", inputs: [{id:"angle", label:"Angle (Degrees)"}] },
                { id: "law-cosines", name: "Law of Cosines", icon: "ph-triangle", desc: "Find side c given sides a, b and angle C", inputs: [{id:"a", label:"Side a"}, {id:"b", label:"Side b"}, {id:"angle", label:"Angle C (Degrees)"}] },
                { id: "law-sines", name: "Law of Sines", icon: "ph-triangle", desc: "Find side a given side b and two angles", inputs: [{id:"b", label:"Side b"}, {id:"angleA", label:"Angle A (Deg)"}, {id:"angleB", label:"Angle B (Deg)"}] }
            ]
        },
        {
            category: "Calculus",
            items: [
                { id: "derivative", name: "Derivative (Power Rule)", icon: "ph-chart-line-up", desc: "Find derivative of ax^n", inputs: [{id:"a", label:"Coefficient (a)"}, {id:"n", label:"Exponent (n)"}] },
                { id: "integral", name: "Indefinite Integral", icon: "ph-math-operations", desc: "Find integral of ax^n dx", inputs: [{id:"a", label:"Coefficient (a)"}, {id:"n", label:"Exponent (n)"}] }
            ]
        },
        {
            category: "Finance",
            items: [
                { id: "compound", name: "Compound Interest", icon: "ph-bank", desc: "Calculate compounded growth", inputs: [{id:"p", label:"Principal (P)"}, {id:"r", label:"Rate (%)"}, {id:"n", label:"Compounds/Year (n)"}, {id:"t", label:"Years (t)"}] }
            ]
        }
    ];

    // --- Initialization ---
    init();

    function init() {
        renderDashboard();
        ui.logoBtn.addEventListener('click', showDashboard);
        ui.backBtn.addEventListener('click', showDashboard);
        ui.calcBtn.addEventListener('click', handleCalculate);
        ui.themeToggle.addEventListener('click', toggleTheme);
    }

    function renderDashboard() {
        ui.gridContainer.innerHTML = '';
        calculatorsConfig.forEach(category => {
            const group = document.createElement('div');
            group.className = 'category-group';
            group.innerHTML = `<h2 class="category-title">${category.category}</h2>`;
            const grid = document.createElement('div');
            grid.className = 'calc-grid';
            category.items.forEach(calc => {
                const card = document.createElement('div');
                card.className = 'calc-card';
                card.onclick = () => openCalculator(calc);
                card.innerHTML = `<i class="ph ${calc.icon}"></i><div class="calc-card-content"><h3>${calc.name}</h3><p>${calc.desc}</p></div>`;
                grid.appendChild(card);
            });
            group.appendChild(grid);
            ui.gridContainer.appendChild(group);
        });
    }

    function openCalculator(calcObj) {
        currentCalculator = calcObj;
        ui.calcIcon.className = `ph ${calcObj.icon}`;
        ui.calcTitle.innerText = calcObj.name;
        ui.calcDesc.innerText = calcObj.desc;
        ui.form.innerHTML = '';
        calcObj.inputs.forEach(input => {
            const group = document.createElement('div');
            group.className = 'input-group';
            group.innerHTML = `<label for="${input.id}">${input.label}</label><input type="number" id="${input.id}" placeholder="Enter value" required step="any">`;
            ui.form.appendChild(group);
        });
        ui.resultsArea.classList.add('hidden');
        views.dashboard.classList.add('hidden');
        views.workspace.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showDashboard() {
        views.workspace.classList.add('hidden');
        views.dashboard.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- 2. Routing Logic ---
    function handleCalculate() {
        const inputs = Array.from(ui.form.querySelectorAll('input'));
        if (inputs.some(input => input.value === '')) return alert('Please fill in all fields.');

        const v = {};
        inputs.forEach(inp => v[inp.id] = parseFloat(inp.value));

        const originalText = ui.calcBtn.innerHTML;
        ui.calcBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processing...';
        
        setTimeout(() => {
            ui.calcBtn.innerHTML = originalText;
            try {
                let r;
                switch (currentCalculator.id) {
                    case 'linear': r = solveLinear(v.a, v.b, v.c); break;
                    case 'quadratic': r = solveQuadratic(v.a, v.b, v.c); break;
                    case 'percentage': r = solvePercentage(v.p, v.x); break;
                    case 'distance': r = solveDistance(v.x1, v.y1, v.x2, v.y2); break;
                    case 'circle-area': r = solveCircleArea(v.r); break;
                    case 'rectangle-area': r = solveRectArea(v.l, v.w); break;
                    case 'cylinder-volume': r = solveCylinder(v.r, v.h); break;
                    case 'sphere-volume': r = solveSphere(v.r); break;
                    case 'pythagorean': r = solvePythagorean(v.a, v.b); break;
                    case 'sine': r = solveSine(v.angle); break;
                    case 'law-cosines': r = solveLawCosines(v.a, v.b, v.angle); break;
                    case 'law-sines': r = solveLawSines(v.b, v.angleA, v.angleB); break;
                    case 'derivative': r = solveDerivative(v.a, v.n); break;
                    case 'integral': r = solveIntegral(v.a, v.n); break;
                    case 'compound': r = solveCompound(v.p, v.r, v.n, v.t); break;
                    default: return alert("Calculator logic not found.");
                }
                renderResults(r);
            } catch (err) { alert(err.message); }
        }, 300);
    }

    // --- 3. Mathematical Logic Engines ---

    function solveLinear(a, b, c) {
        if (a === 0) throw new Error("Coefficient 'a' cannot be 0.");
        const x = (c - b) / a;
        return {
            finalAnswerTex: `x = ${parseFloat(x.toFixed(4))}`,
            steps: [{ desc: "Write equation.", math: `${a}x + ${b} = ${c}` }, { desc: "Isolate x term.", math: `${a}x = ${c} - ${b} = ${c - b}` }, { desc: `Divide by ${a}.`, math: `x = \\frac{${c - b}}{${a}}` }],
            formulaTex: `x = \\frac{c - b}{a}`, variablesHtml: "<p><strong>a</strong>: slope, <strong>b</strong>: intercept, <strong>x</strong>: variable</p>", simpleExp: "We reversed the operations to isolate the unknown variable.", mathExp: "Solves a first-degree polynomial to find its root.", verificationHtml: "Plug x back into the original equation to ensure both sides balance.",
            graphData: { f: (xv) => a*xv + b, label: `f(x)=${a}x+${b}`, center: x },
            edu: { what:"Straight line equation.", why:"Finding unknowns in linear relations.", real:"Budgeting, speed/time.", apps:"<li>Finance</li>", adv:"<li>Simple</li>", lim:"<li>No curves</li>", mistakes:"<li>Sign errors</li>", related:"<li>Systems</li>", practice:"a=2, b=4, c=10" }
        };
    }

    function solveQuadratic(a, b, c) {
        if (a===0) throw new Error("A cannot be 0.");
        const d = (b*b) - (4*a*c);
        let finalTex, steps = [{ desc:"Coefficients", math:`a=${a}, b=${b}, c=${c}` }, { desc:"Discriminant (b²-4ac)", math:`\\Delta = ${d}` }];
        if (d >= 0) {
            const root1 = (-b + Math.sqrt(d))/(2*a), root2 = (-b - Math.sqrt(d))/(2*a);
            finalTex = `x_1 = ${root1.toFixed(4)}, \\; x_2 = ${root2.toFixed(4)}`;
            steps.push({ desc:"Real roots.", math: finalTex });
        } else {
            finalTex = "\\text{Complex Roots}";
            steps.push({ desc:"Roots are imaginary.", math: `x = \\frac{-${b} \\pm i\\sqrt{${Math.abs(d)}}}{${2*a}}` });
        }
        return {
            finalAnswerTex: finalTex, steps, formulaTex: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`, variablesHtml:"<p>a,b,c: Coefficients, Δ: Discriminant</p>", simpleExp: "Plugged values into quadratic formula.", mathExp: "Finds x-intercepts of a parabola.", verificationHtml: "Plug roots into ax²+bx+c=0.",
            graphData: { f: (xv) => a*xv*xv + b*xv + c, label: `f(x)=${a}x²+${b}x+${c}`, center: -b/(2*a) },
            edu: { what:"Second-degree polynomial.", why:"To model parabolic curves.", real:"Projectile motion.", apps:"<li>Physics</li>", adv:"<li>Always works</li>", lim:"<li>Complex roots</li>", mistakes:"<li>Sign errors</li>", related:"<li>Factoring</li>", practice:"A=1, B=0, C=-4" }
        };
    }

    function solvePercentage(p, x) {
        const res = (p / 100) * x;
        return {
            finalAnswerTex: `${p}\\% \\text{ of } ${x} = ${res.toFixed(2)}`,
            steps: [{ desc:"Convert to decimal", math:`${p}/100 = ${p/100}` }, { desc:"Multiply by value", math:`${p/100} \\times ${x} = ${res}` }],
            formulaTex: `R = \\frac{P}{100} \\times X`, variablesHtml:"<p>P: Percentage, X: Base Value</p>", simpleExp: "Shifted decimal 2 places left and multiplied.", mathExp: "Calculates a proportional fraction of a whole.", verificationHtml: `Verify: ${res} / ${x} = ${p/100}`, graphData: null,
            edu: { what:"Proportional calculation based on 100.", why:"Standardized comparisons.", real:"Taxes, discounts.", apps:"<li>Retail</li>", adv:"<li>Universal</li>", lim:"<li>Needs context</li>", mistakes:"<li>Dividing instead of multiplying</li>", related:"<li>Fractions</li>", practice:"p=20, x=50" }
        };
    }

    function solveDistance(x1, y1, x2, y2) {
        const d2 = Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2);
        const d = Math.sqrt(d2);
        return {
            finalAnswerTex: `d \\approx ${d.toFixed(4)}`,
            steps: [{ desc:"Formula", math:`d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}` }, { desc:"Substitute", math:`d = \\sqrt{(${x2}-${x1})^2 + (${y2}-${y1})^2}` }, { desc:"Simplify", math:`d = \\sqrt{${d2}}` }],
            formulaTex: `d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}`, variablesHtml:"<p>x,y: Coordinates</p>", simpleExp: "Found horizontal and vertical differences, then used Pythagoras.", mathExp: "Euclidean distance metric.", verificationHtml: "Distance is always positive.", graphData: null,
            edu: { what:"Length of straight line between points.", why:"Spatial analysis.", real:"GPS navigation.", apps:"<li>Mapping</li>", adv:"<li>Exact</li>", lim:"<li>Fails on globes</li>", mistakes:"<li>Mixing x and y</li>", related:"<li>Pythagoras</li>", practice:"x1=0, y1=0, x2=3, y2=4" }
        };
    }

    function solveCircleArea(r) {
        if(r<0) throw new Error("Radius cannot be negative");
        const a = Math.PI * r * r;
        return {
            finalAnswerTex: `A \\approx ${a.toFixed(4)}`,
            steps: [{ desc:"Square radius", math:`r^2 = ${r*r}` }, { desc:"Multiply by Pi", math:`A = \\pi \\times ${r*r}` }],
            formulaTex: `A = \\pi r^2`, variablesHtml:"<p>r: Radius, π: Constant</p>", simpleExp: "Squared radius, multiplied by Pi.", mathExp: "Integration of 2πr from 0 to r.", verificationHtml: `r = √(A/π)`, graphData: null,
            edu: { what:"Total 2D space of circle.", why:"Geometry.", real:"Pizza sizes.", apps:"<li>Architecture</li>", adv:"<li>Exact</li>", lim:"<li>Perfect circles only</li>", mistakes:"<li>Using diameter instead of radius</li>", related:"<li>Circumference</li>", practice:"r=5" }
        };
    }

    function solveRectArea(l, w) {
        if(l<0||w<0) throw new Error("Dimensions must be positive");
        return {
            finalAnswerTex: `A = ${l*w}`,
            steps: [{ desc:"Multiply Length by Width", math:`${l} \\times ${w} = ${l*w}` }],
            formulaTex: `A = l \\times w`, variablesHtml:"<p>l: Length, w: Width</p>", simpleExp: "Multiplied length by width.", mathExp: "Base times height.", verificationHtml: `${l*w} / l = w`, graphData: null,
            edu: { what:"2D space of rectangle.", why:"Basic geometry.", real:"Floor plans.", apps:"<li>Construction</li>", adv:"<li>Simple</li>", lim:"<li>None</li>", mistakes:"<li>Adding instead of multiplying</li>", related:"<li>Perimeter</li>", practice:"l=5, w=4" }
        };
    }

    function solveCylinder(r, h) {
        if(r<0||h<0) throw new Error("Values must be positive");
        const v = Math.PI * r * r * h;
        return {
            finalAnswerTex: `V \\approx ${v.toFixed(4)}`,
            steps: [{ desc:"Base Area", math:`A = \\pi(${r})^2 = ${(Math.PI*r*r).toFixed(4)}` }, { desc:"Multiply by Height", math:`V = ${h} \\times A = ${v.toFixed(4)}` }],
            formulaTex: `V = \\pi r^2 h`, variablesHtml:"<p>r: radius, h: height</p>", simpleExp: "Found area of circle base, multiplied by height.", mathExp: "Extrusion of 2D circle into 3D space.", verificationHtml: "Check units (cubed).", graphData: null,
            edu: { what:"3D space inside cylinder.", why:"Capacities.", real:"Water tanks.", apps:"<li>Engineering</li>", adv:"<li>Accurate</li>", lim:"<li>Assumes perfect cylinder</li>", mistakes:"<li>Forgetting to square radius</li>", related:"<li>Cone Volume</li>", practice:"r=2, h=10" }
        };
    }

    function solveSphere(r) {
        if(r<0) throw new Error("Radius must be positive");
        const v = (4/3) * Math.PI * Math.pow(r, 3);
        return {
            finalAnswerTex: `V \\approx ${v.toFixed(4)}`,
            steps: [{ desc:"Cube radius", math:`r^3 = ${Math.pow(r,3)}` }, { desc:"Multiply by 4/3 Pi", math:`V = \\frac{4}{3}\\pi(${Math.pow(r,3)})` }],
            formulaTex: `V = \\frac{4}{3}\\pi r^3`, variablesHtml:"<p>r: radius</p>", simpleExp: "Cubed radius and scaled by mathematical constant.", mathExp: "Integral of surface area.", verificationHtml: "Volume increases drastically with radius.", graphData: null,
            edu: { what:"3D space of a ball.", why:"Volume calculation.", real:"Planets.", apps:"<li>Astronomy</li>", adv:"<li>Exact</li>", lim:"<li>Perfect spheres only</li>", mistakes:"<li>Squaring instead of cubing</li>", related:"<li>Circle Area</li>", practice:"r=3" }
        };
    }

    function solvePythagorean(a, b) {
        if(a<=0||b<=0) throw new Error("Sides must be > 0");
        const c = Math.sqrt(a*a + b*b);
        return {
            finalAnswerTex: `c \\approx ${c.toFixed(4)}`,
            steps: [{ desc:"Square sides", math:`a^2=${a*a}, b^2=${b*b}` }, { desc:"Add together", math:`c^2 = ${a*a+b*b}` }, { desc:"Take Square Root", math:`c = \\sqrt{${a*a+b*b}}` }],
            formulaTex: `c = \\sqrt{a^2+b^2}`, variablesHtml:"<p>a,b: Legs, c: Hypotenuse</p>", simpleExp:"Squared, added, rooted.", mathExp:"Euclidean metric.", verificationHtml:"c must be greater than a and b.", graphData: null,
            edu: { what:"Right triangle theorem.", why:"Finding lengths.", real:"Construction.", apps:"<li>Architecture</li>", adv:"<li>Fundamental</li>", lim:"<li>Only right triangles</li>", mistakes:"<li>Adding before squaring</li>", related:"<li>Trig</li>", practice:"a=3, b=4" }
        };
    }

    function solveSine(angle) {
        const rad = angle * (Math.PI/180);
        const res = Math.sin(rad);
        return {
            finalAnswerTex: `\\sin(${angle}^\\circ) = ${res.toFixed(4)}`,
            steps: [{ desc:"Convert to radians", math:`${angle} \\times \\frac{\\pi}{180} = ${rad.toFixed(4)}` }, { desc:"Calculate sine", math:`\\sin(${rad.toFixed(4)}) = ${res.toFixed(4)}` }],
            formulaTex: `\\sin(\\theta) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}`, variablesHtml:"<p>θ: Angle</p>", simpleExp: "Found ratio of opposite side to hypotenuse.", mathExp: "Y-coordinate on unit circle.", verificationHtml: "Sine is always between -1 and 1.",
            graphData: { f: (x) => Math.sin(x*(Math.PI/180)), label:`sin(x)`, center: angle },
            edu: { what:"Trigonometric ratio.", why:"Wave analysis.", real:"Sound waves.", apps:"<li>Physics</li>", adv:"<li>Periodic</li>", lim:"<li>None</li>", mistakes:"<li>Degree/Radian mixup</li>", related:"<li>Cosine</li>", practice:"Angle=30" }
        };
    }

    function solveLawCosines(a, b, angleC) {
        if(a<=0||b<=0) throw new Error("Sides must be > 0");
        const rad = angleC * (Math.PI/180);
        const c2 = (a*a) + (b*b) - (2*a*b*Math.cos(rad));
        const c = Math.sqrt(c2);
        return {
            finalAnswerTex: `c \\approx ${c.toFixed(4)}`,
            steps: [{ desc:"Substitute", math:`c^2 = ${a}^2 + ${b}^2 - 2(${a})(${b})\\cos(${angleC}^\\circ)` }, { desc:"Calculate Right Side", math:`c^2 = ${c2.toFixed(4)}` }, { desc:"Square Root", math:`c = \\sqrt{${c2.toFixed(4)}}` }],
            formulaTex: `c^2 = a^2+b^2-2ab\\cos(C)`, variablesHtml:"<p>a,b: Sides, C: Angle</p>", simpleExp:"Adjusted Pythagoras for non-right triangles.", mathExp:"Generalized theorem.", verificationHtml:"Triangle inequality applies.", graphData: null,
            edu: { what:"Generalized Pythagoras.", why:"Non-right triangles.", real:"Surveying.", apps:"<li>Navigation</li>", adv:"<li>Works on any triangle</li>", lim:"<li>Need 2 sides + included angle</li>", mistakes:"<li>Radians/Degrees</li>", related:"<li>Law of Sines</li>", practice:"a=5, b=5, C=60" }
        };
    }

    function solveLawSines(b, aA, aB) {
        const rA = aA*(Math.PI/180), rB = aB*(Math.PI/180);
        if(Math.sin(rB)===0) throw new Error("Invalid angle.");
        const a = (b * Math.sin(rA)) / Math.sin(rB);
        return {
            finalAnswerTex: `a \\approx ${a.toFixed(4)}`,
            steps: [{ desc:"Setup Ratio", math:`\\frac{a}{\\sin(${aA}^\\circ)} = \\frac{${b}}{\\sin(${aB}^\\circ)}` }, { desc:"Isolate Unknown Side (a)", math:`a = \\frac{${b}\\sin(${aA}^\\circ)}{\\sin(${aB}^\\circ)}` }],
            formulaTex: `a = \\frac{b\\sin(A)}{\\sin(B)}`, variablesHtml:"<p>a,b: Sides, A,B: Angles</p>", simpleExp:"Cross multiplied ratios.", mathExp:"Proportionality of sine.", verificationHtml:"Interior angles sum to 180.", graphData: null,
            edu: { what:"Sine proportionality.", why:"Missing sides.", real:"Astronomy.", apps:"<li>Surveying</li>", adv:"<li>Fast</li>", lim:"<li>Ambiguous case possible</li>", mistakes:"<li>Wrong pairs</li>", related:"<li>Law of Cosines</li>", practice:"b=10, A=30, B=45" }
        };
    }

    function solveDerivative(a, n) {
        const c = a*n, e = n-1;
        let ans = e===0 ? `${c}` : (e===1 ? `${c}x` : `${c}x^{${e}}`);
        return {
            finalAnswerTex: `f'(x) = ${ans}`,
            steps: [{ desc:"Apply Power Rule", math:`\\frac{d}{dx}[${a}x^{${n}}] = (${a}\\cdot${n})x^{${n}-1}` }, { desc:"Simplify", math: ans }],
            formulaTex: `\\frac{d}{dx}ax^n = anx^{n-1}`, variablesHtml:"<p>a: Coef, n: Power</p>", simpleExp:"Multiply power by front number, drop power by 1.", mathExp:"Instantaneous rate of change.", verificationHtml:"Integrate to check.",
            graphData: { f: (x) => a*Math.pow(x,n), label:`Original: f(x)=${a}x^${n}`, center: 0 },
            edu: { what:"Derivative.", why:"Rates of change.", real:"Velocity from position.", apps:"<li>Physics</li>", adv:"<li>Exact slope</li>", lim:"<li>Polynomials only here</li>", mistakes:"<li>Forgetting to subtract 1</li>", related:"<li>Integrals</li>", practice:"a=3, n=2" }
        };
    }

    function solveIntegral(a, n) {
        if(n === -1) return {
            finalAnswerTex: `\\int ${a}x^{-1} dx = ${a}\\ln|x| + C`, steps:[{desc:"Special Log Rule", math:`\\ln|x|`}], formulaTex:`\\int x^{-1} = \\ln|x|`, variablesHtml:"", simpleExp:"Special case for x^-1", mathExp:"Natural log.", verificationHtml:"Derive to check.", graphData:null,
            edu:{what:"Integral", why:"Area under curve", real:"Accumulation", apps:"<li>Physics</li>", adv:"<li>Exact</li>", lim:"<li>None</li>", mistakes:"<li>Forgetting + C</li>", related:"<li>Derivatives</li>", practice:"a=1, n=-1"}
        };
        const c = a/(n+1), e = n+1;
        return {
            finalAnswerTex: `\\int f(x)dx = ${c.toFixed(2)}x^{${e}} + C`,
            steps: [{ desc:"Apply Reverse Power Rule", math:`\\frac{${a}}{${n}+1}x^{${n}+1} + C` }, { desc:"Simplify", math: `${c.toFixed(2)}x^{${e}} + C` }],
            formulaTex: `\\int ax^n dx = \\frac{a}{n+1}x^{n+1} + C`, variablesHtml:"<p>a: Coef, n: Power, C: Constant</p>", simpleExp:"Add 1 to power, divide by new power.", mathExp:"Antiderivative.", verificationHtml:"Derive to get original function.",
            graphData: { f: (x) => c*Math.pow(x,e), label:`Antiderivative F(x)`, center: 0 },
            edu: { what:"Indefinite Integral.", why:"Accumulated area.", real:"Total distance from velocity.", apps:"<li>Engineering</li>", adv:"<li>Exact area</li>", lim:"<li>Needs bounds for definite value</li>", mistakes:"<li>Forgetting + C</li>", related:"<li>Derivatives</li>", practice:"a=2, n=1" }
        };
    }

    function solveCompound(p, r, n, t) {
        const rate = r/100;
        const a = p * Math.pow(1 + (rate/n), n*t);
        return {
            finalAnswerTex: `A = \\$${a.toFixed(2)}`,
            steps: [{ desc:"Convert Rate to Decimal", math:`r = ${rate}` }, { desc:"Apply Formula", math:`A = ${p}(1 + \\frac{${rate}}{${n}})^{${n}\\times${t}}` }, { desc:"Simplify Exponents & Calculate", math:`A = ${p}(${(1+rate/n).toFixed(4)})^{${n*t}}` }],
            formulaTex: `A = P(1+\\frac{r}{n})^{nt}`, variablesHtml:"<p>P: Principal, r: Rate, n: Compounds/yr, t: Years</p>", simpleExp:"Calculated interest earning its own interest.", mathExp:"Exponential growth function.", verificationHtml:"A should always be greater than P.",
            graphData: { f: (xv) => p*Math.pow(1+rate/n, n*xv), label:`Growth Trajectory`, center: Math.max(t/2, 5) },
            edu: { what:"Exponential interest model.", why:"Banking and Investing.", real:"Savings accounts, Mortgages.", apps:"<li>Finance</li>", adv:"<li>Real-world accurate</li>", lim:"<li>Ignores inflation</li>", mistakes:"<li>Rate not decimalized</li>", related:"<li>Simple Interest</li>", practice:"P=1000, r=5, n=12, t=10" }
        };
    }

    // --- 4. Render Engine ---
    
    function renderResults(data) {
        ui.resultsArea.classList.remove('hidden');
        renderKatex('res-final-answer', data.finalAnswerTex);

        const container = document.getElementById('res-steps');
        container.innerHTML = '';
        data.steps.forEach((step, idx) => {
            const el = document.createElement('div');
            el.className = 'step-item';
            el.innerHTML = `<div class="step-number">${idx + 1}</div><div class="step-content"><div class="step-desc">${step.desc}</div><div class="step-math" id="math-step-${idx}"></div></div>`;
            container.appendChild(el);
            renderKatex(`math-step-${idx}`, step.math);
        });

        renderKatex('res-formula', data.formulaTex);
        document.getElementById('res-variables').innerHTML = data.variablesHtml;
        document.getElementById('res-simple-exp').innerText = data.simpleExp;
        document.getElementById('res-math-exp').innerText = data.mathExp;
        document.getElementById('res-verification').innerHTML = data.verificationHtml;

        document.getElementById('edu-what').innerText = data.edu.what;
        document.getElementById('edu-why').innerText = data.edu.why;
        document.getElementById('edu-real').innerText = data.edu.real;
        document.getElementById('edu-apps').innerHTML = data.edu.apps;
        document.getElementById('edu-adv').innerHTML = data.edu.adv;
        document.getElementById('edu-lim').innerHTML = data.edu.lim;
        document.getElementById('edu-mistakes').innerHTML = data.edu.mistakes;
        document.getElementById('edu-related').innerHTML = data.edu.related;
        document.getElementById('edu-practice').innerText = data.edu.practice;

        if (data.graphData) {
            ui.graphCard.classList.remove('hidden');
            drawGraph(data.graphData);
        } else {
            ui.graphCard.classList.add('hidden');
        }
        ui.resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderKatex(elementId, texString) {
        const el = document.getElementById(elementId);
        if (el) katex.render(texString, el, { displayMode: true, throwOnError: false });
    }

    function drawGraph(graphData) {
        const ctx = document.getElementById('mathGraph').getContext('2d');
        if (chartInstance) chartInstance.destroy();

        const xValues = [], yValues = [];
        const center = graphData.center || 0;
        
        for (let x = center - 5; x <= center + 5; x += 0.5) {
            xValues.push(x.toFixed(1));
            yValues.push(graphData.f(x));
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const gridColor = isDark ? '#334155' : '#E2E8F0';
        const textColor = isDark ? '#94A3B8' : '#64748B';

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [{
                    label: graphData.label, data: yValues, borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)', borderWidth: 2, tension: 0.4, fill: true, pointRadius: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: { x: { grid: { color: gridColor }, ticks: { color: textColor } }, y: { grid: { color: gridColor }, ticks: { color: textColor } } }
            }
        });
    }

    function toggleTheme() {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        ui.themeToggle.innerHTML = newTheme === 'light' ? '<i class="ph ph-moon"></i>' : '<i class="ph ph-sun"></i>';
        if (chartInstance && !ui.resultsArea.classList.contains('hidden')) {
            // Re-trigger calculation purely to re-render the chart with correct dark mode colors
            handleCalculate();
        }
    }
});