/**
 * MathCore - Intelligent Calculator Engine (Fully Client-Side)
 * Handles dynamic UI, actual mathematical calculations, step generation,
 * and educational content rendering without needing a backend.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- State & DOM Elements ---
    let currentCalculator = null;
    let chartInstance = null;

    const views = {
        dashboard: document.getElementById('dashboard-view'),
        workspace: document.getElementById('workspace-view')
    };
    
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
        themeToggle: document.getElementById('theme-toggle')
    };

    // --- Calculator Database with Strict Inputs ---
    const calculatorsConfig = [
        {
            category: "Algebra",
            items: [
                { id: "linear", name: "Linear Equation", icon: "ph-trend-up", desc: "Solve equations of form ax + b = c", inputs: [{id:"a", label:"Coefficient a"}, {id:"b", label:"Constant b"}, {id:"c", label:"Result c"}] },
                { id: "quadratic", name: "Quadratic Equation", icon: "ph-parabola", desc: "Solve polynomials of form ax² + bx + c = 0", inputs: [{id:"a", label:"Coefficient A (x²)"}, {id:"b", label:"Coefficient B (x)"}, {id:"c", label:"Constant C"}] }
            ]
        },
        {
            category: "Geometry",
            items: [
                { id: "circle-area", name: "Circle Area", icon: "ph-circle", desc: "Calculate area using radius", inputs: [{id:"r", label:"Radius (r)"}] },
                { id: "pythagorean", name: "Pythagorean Theorem", icon: "ph-line-segments", desc: "Find hypotenuse (c) from sides (a, b)", inputs: [{id:"a", label:"Side a"}, {id:"b", label:"Side b"}] }
            ]
        },
        {
            category: "Trigonometry",
            items: [
                { id: "law-cosines", name: "Law of Cosines", icon: "ph-triangle", desc: "Find side c given sides a, b and angle C", inputs: [{id:"a", label:"Side a"}, {id:"b", label:"Side b"}, {id:"angle", label:"Angle C (Degrees)"}] }
            ]
        },
        {
            category: "Calculus",
            items: [
                { id: "derivative", name: "Derivative (Power Rule)", icon: "ph-chart-line-up", desc: "Find derivative of ax^n", inputs: [{id:"a", label:"Coefficient (a)"}, {id:"n", label:"Exponent (n)"}] }
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
                card.innerHTML = `
                    <i class="ph ${calc.icon}"></i>
                    <div class="calc-card-content">
                        <h3>${calc.name}</h3>
                        <p>${calc.desc}</p>
                    </div>
                `;
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
            group.innerHTML = `
                <label for="${input.id}">${input.label}</label>
                <input type="number" id="${input.id}" placeholder="Enter value" required step="any">
            `;
            ui.form.appendChild(group);
        });

        ui.resultsArea.classList.add('hidden');
        views.dashboard.classList.add('hidden');
        views.workspace.classList.remove('hidden');
        views.workspace.scrollIntoView({ behavior: 'smooth' });
    }

    function showDashboard() {
        views.workspace.classList.add('hidden');
        views.dashboard.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Intelligent Router ---
    function handleCalculate() {
        const inputs = Array.from(ui.form.querySelectorAll('input'));
        if (inputs.some(input => input.value === '')) return alert('Please fill in all fields.');

        const vals = {};
        inputs.forEach(inp => vals[inp.id] = parseFloat(inp.value));

        const originalText = ui.calcBtn.innerHTML;
        ui.calcBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processing...';
        
        setTimeout(() => {
            ui.calcBtn.innerHTML = originalText;
            
            let resultData;
            try {
                // Route to the correct mathematical logic function
                switch (currentCalculator.id) {
                    case 'linear': resultData = solveLinear(vals.a, vals.b, vals.c); break;
                    case 'quadratic': resultData = solveQuadratic(vals.a, vals.b, vals.c); break;
                    case 'circle-area': resultData = solveCircleArea(vals.r); break;
                    case 'pythagorean': resultData = solvePythagorean(vals.a, vals.b); break;
                    case 'law-cosines': resultData = solveLawCosines(vals.a, vals.b, vals.angle); break;
                    case 'derivative': resultData = solveDerivative(vals.a, vals.n); break;
                    default: return alert("Calculator logic not found.");
                }
                renderResults(resultData);
            } catch (error) {
                alert(error.message);
            }
        }, 300);
    }

    // ==========================================
    // MATHEMATICAL LOGIC ENGINES
    // ==========================================

    function solveLawCosines(a, b, angleC) {
        if (a <= 0 || b <= 0) throw new Error("Sides must be positive.");
        
        const rad = angleC * (Math.PI / 180);
        const cosVal = Math.cos(rad);
        const cSquared = (a*a) + (b*b) - (2 * a * b * cosVal);
        const c = Math.sqrt(cSquared);

        return {
            finalAnswerTex: `c \\approx ${c.toFixed(4)}`,
            steps: [
                { desc: "Identify sides and angle.", math: `a = ${a}, \\; b = ${b}, \\; \\angle C = ${angleC}^\\circ` },
                { desc: "Write the Law of Cosines formula.", math: `c^2 = a^2 + b^2 - 2ab \\cos(C)` },
                { desc: "Substitute the known values.", math: `c^2 = ${a}^2 + ${b}^2 - 2(${a})(${b}) \\cos(${angleC}^\\circ)` },
                { desc: "Calculate squares and cosine.", math: `c^2 = ${a*a} + ${b*b} - ${2*a*b}(${cosVal.toFixed(4)})` },
                { desc: "Simplify the right side.", math: `c^2 = ${(a*a + b*b)} - ${(2*a*b*cosVal).toFixed(4)} = ${cSquared.toFixed(4)}` },
                { desc: "Take the square root to find c.", math: `c = \\sqrt{${cSquared.toFixed(4)}} \\approx ${c.toFixed(4)}` }
            ],
            formulaTex: `c^2 = a^2 + b^2 - 2ab \\cos(C)`,
            variablesHtml: `<p><strong>a, b</strong>: Known side lengths</p><p><strong>c</strong>: Unknown side opposite to angle C</p><p><strong>C</strong>: Included angle</p>`,
            simpleExp: "The Law of Cosines is an extension of the Pythagorean theorem for triangles that do not have a 90-degree angle. By subtracting a correction factor based on the angle between the two known sides, we can find the exact length of the third side.",
            mathExp: `Using trigonometric projection, the side $c$ is determined by adjusting the sum of squares $a^2 + b^2$ by the factor $2ab\\cos(C)$. Since $\\cos(${angleC}^\\circ) \\approx ${cosVal.toFixed(4)}$, the correction ensures accurate length.`,
            verificationHtml: "Verification can be done using the Law of Sines if other angles are known.",
            graphData: null,
            edu: {
                what: "An equation relating the lengths of the sides of a triangle to the cosine of one of its angles.",
                why: "Used when dealing with oblique (non-right) triangles where the Pythagorean theorem does not apply.",
                real: "Surveying land, celestial navigation, and measuring distances across impassable terrain.",
                apps: "<li>Calculating flight paths with wind drift.</li><li>Computer graphics rendering.</li>",
                adv: "<li>Works for ANY triangle, not just right triangles.</li>",
                lim: "<li>Requires knowing either 3 sides (to find an angle) or 2 sides and the included angle.</li>",
                mistakes: "<li>Using degrees when the calculator expects radians.</li><li>Forgetting to take the square root at the very end.</li>",
                related: "<li>Law of Sines</li><li>Pythagorean Theorem</li>",
                practice: "Try a=5, b=7, Angle C=45 degrees."
            }
        };
    }

    function solveLinear(a, b, c) {
        if (a === 0) throw new Error("Coefficient 'a' cannot be 0.");
        const x = (c - b) / a;
        return {
            finalAnswerTex: `x = ${parseFloat(x.toFixed(4))}`,
            steps: [
                { desc: "Write the equation.", math: `${a}x + ${b} = ${c}` },
                { desc: `Isolate the x term by subtracting ${b} from both sides.`, math: `${a}x = ${c} - ${b}` },
                { desc: "Simplify the right side.", math: `${a}x = ${c - b}` },
                { desc: `Divide by ${a} to solve for x.`, math: `x = \\frac{${c - b}}{${a}}` },
                { desc: "Final result.", math: `x = ${parseFloat(x.toFixed(4))}` }
            ],
            formulaTex: `ax + b = c \\implies x = \\frac{c - b}{a}`,
            variablesHtml: `<p><strong>a</strong>: Rate of change (slope)</p><p><strong>b</strong>: Initial value (y-intercept)</p><p><strong>x</strong>: Unknown variable</p>`,
            simpleExp: "We solved for the unknown variable by doing the opposite of what the equation says. We subtracted the constant, then divided by the multiplier.",
            mathExp: "Linear equations represent a straight line. By solving for x, we are finding the exact point on the x-axis where the function evaluates to a specific value.",
            verificationHtml: `Plug x back in: ${a}(${parseFloat(x.toFixed(4))}) + ${b} = ${c}.`,
            graphData: {
                type: 'linear', f: (x_val) => a * x_val + b, label: `f(x) = ${a}x + ${b}`, center: x
            },
            edu: {
                what: "A mathematical statement that describes a straight line, representing a constant rate of change.",
                why: "It is the foundation of algebra, used to find an unknown value when relationships are strictly proportional.",
                real: "Calculating total cost (e.g., flat fee + hourly rate).",
                apps: "<li>Budgeting</li><li>Predicting travel times</li>",
                adv: "<li>Extremely easy to compute and graph.</li>",
                lim: "<li>Cannot model curved relationships or accelerating growth.</li>",
                mistakes: "<li>Adding when you should subtract to move a term across the equals sign.</li>",
                related: "<li>Slope-Intercept Form</li><li>Systems of Equations</li>",
                practice: "Try a=3, b=2, c=11. (Answer should be 3)."
            }
        };
    }

    function solveQuadratic(a, b, c) {
        if (a === 0) throw new Error("Coefficient A cannot be 0.");
        const discriminant = (b * b) - (4 * a * c);
        let finalTex = "";
        let steps = [
            { desc: "Identify coefficients.", math: `a = ${a}, \\; b = ${b}, \\; c = ${c}` },
            { desc: "Use quadratic formula.", math: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}` },
            { desc: "Calculate discriminant (b² - 4ac).", math: `\\Delta = ${b*b} - (${4*a*c}) = ${discriminant}` }
        ];

        if (discriminant > 0) {
            const root = Math.sqrt(discriminant);
            const x1 = (-b + root) / (2 * a);
            const x2 = (-b - root) / (2 * a);
            steps.push({ desc: "Solve for the two real roots.", math: `x_1 = ${parseFloat(x1.toFixed(4))}, \\quad x_2 = ${parseFloat(x2.toFixed(4))}` });
            finalTex = `x_1 = ${parseFloat(x1.toFixed(4))}, \\quad x_2 = ${parseFloat(x2.toFixed(4))}`;
        } else if (discriminant === 0) {
            const x = -b / (2 * a);
            steps.push({ desc: "Solve for the single root.", math: `x = ${parseFloat(x.toFixed(4))}` });
            finalTex = `x = ${parseFloat(x.toFixed(4))}`;
        } else {
            steps.push({ desc: "Roots are complex.", math: `x = \\frac{-${b} \\pm i\\sqrt{${Math.abs(discriminant)}}}{${2*a}}` });
            finalTex = `\\text{Complex Roots}`;
        }

        return {
            finalAnswerTex: finalTex,
            steps: steps,
            formulaTex: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
            variablesHtml: `<p><strong>a,b,c</strong>: Coefficients</p><p><strong>Δ</strong>: Discriminant</p>`,
            simpleExp: "We plugged the numbers into the quadratic formula to find where the curved line crosses the zero line.",
            mathExp: "The discriminant determines the nature of the roots. Here Δ=" + discriminant + ".",
            verificationHtml: "Plug x back into ax² + bx + c = 0.",
            graphData: { type: 'quadratic', f: (x_val) => (a * x_val * x_val) + (b * x_val) + c, label: `f(x) = ${a}x² + ${b}x + ${c}`, center: -b / (2 * a) },
            edu: {
                what: "A second-degree polynomial equation.",
                why: "Used to model parabolic trajectories.",
                real: "Throwing a ball, satellite dish shapes.",
                apps: "<li>Physics</li><li>Engineering</li>",
                adv: "<li>Formula works for 100% of cases.</li>",
                lim: "<li>Calculations can be tedious by hand.</li>",
                mistakes: "<li>Sign errors inside the square root.</li>",
                related: "<li>Parabolas</li><li>Factoring</li>",
                practice: "Try A=1, B=-5, C=6."
            }
        };
    }

    function solveCircleArea(r) {
        if (r < 0) throw new Error("Radius cannot be negative.");
        const area = Math.PI * r * r;
        return {
            finalAnswerTex: `A \\approx ${area.toFixed(4)}`,
            steps: [
                { desc: "Identify radius.", math: `r = ${r}` },
                { desc: "Write Area formula.", math: `A = \\pi r^2` },
                { desc: "Square the radius.", math: `r^2 = ${r * r}` },
                { desc: "Multiply by Pi (≈ 3.14159).", math: `A = \\pi \\times ${r * r} \\approx ${area.toFixed(4)}` }
            ],
            formulaTex: `A = \\pi r^2`,
            variablesHtml: `<p><strong>r</strong>: Radius (distance from center to edge)</p><p><strong>π (Pi)</strong>: Math constant (~3.14159)</p>`,
            simpleExp: "To find the space inside a circle, you square its radius and multiply by Pi.",
            mathExp: "The area of a circle represents the 2D space enclosed by its circumference.",
            verificationHtml: `If Area = ${area.toFixed(2)}, then r = √(Area / π) = ${r}.`,
            graphData: null,
            edu: {
                what: "Calculates the total 2D space contained inside a perfect circle.",
                why: "Essential for geometry, manufacturing, and spatial design.",
                real: "Calculating land area, pizza sizes, pipe flow capacities.",
                apps: "<li>Architecture</li><li>Fluid dynamics</li>",
                adv: "<li>Highly accurate constant (Pi).</li>",
                lim: "<li>Only works for perfect circles, not ellipses.</li>",
                mistakes: "<li>Using diameter instead of radius.</li>",
                related: "<li>Circumference</li><li>Cylinder Volume</li>",
                practice: "Try r=5."
            }
        };
    }

    function solvePythagorean(a, b) {
        if (a <= 0 || b <= 0) throw new Error("Sides must be positive.");
        const c2 = (a*a) + (b*b);
        const c = Math.sqrt(c2);
        return {
            finalAnswerTex: `c = \\sqrt{${c2}} \\approx ${c.toFixed(4)}`,
            steps: [
                { desc: "Write theorem.", math: `a^2 + b^2 = c^2` },
                { desc: "Plug in sides.", math: `${a}^2 + ${b}^2 = c^2` },
                { desc: "Square the sides.", math: `${a*a} + ${b*b} = c^2` },
                { desc: "Add them.", math: `${c2} = c^2` },
                { desc: "Square root.", math: `c = \\sqrt{${c2}} \\approx ${c.toFixed(4)}` }
            ],
            formulaTex: `c = \\sqrt{a^2 + b^2}`,
            variablesHtml: `<p><strong>a,b</strong>: Legs of right triangle</p><p><strong>c</strong>: Hypotenuse</p>`,
            simpleExp: "By squaring the two shorter sides and adding them, you get the square of the longest side.",
            mathExp: "Describes Euclidean distance in a flat 2D plane.",
            verificationHtml: `Verify: ${a}² + ${b}² = ${c2}, and ${c.toFixed(2)}² ≈ ${c2}.`,
            graphData: null,
            edu: {
                what: "A fundamental relation in Euclidean geometry among the three sides of a right triangle.",
                why: "To find the shortest distance between two points (the hypotenuse).",
                real: "Construction (making sure walls are square), navigation.",
                apps: "<li>Carpentry</li><li>GPS systems</li>",
                adv: "<li>Simple and strictly accurate in 2D space.</li>",
                lim: "<li>Fails on curved surfaces (like the Earth's surface).</li>",
                mistakes: "<li>Adding side a and b before squaring them.</li>",
                related: "<li>Distance Formula</li><li>Trigonometry</li>",
                practice: "Try a=3, b=4."
            }
        };
    }

    function solveDerivative(a, n) {
        const newCoef = a * n;
        const newExp = n - 1;
        let finalTex = "";
        
        if (n === 0) finalTex = `f'(x) = 0`;
        else if (newExp === 0) finalTex = `f'(x) = ${newCoef}`;
        else if (newExp === 1) finalTex = `f'(x) = ${newCoef}x`;
        else finalTex = `f'(x) = ${newCoef}x^{${newExp}}`;

        return {
            finalAnswerTex: finalTex,
            steps: [
                { desc: "Identify the function.", math: `f(x) = ${a}x^{${n}}` },
                { desc: "Apply the Power Rule: bring exponent down and multiply.", math: `f'(x) = (${a} \\cdot ${n}) x^{${n} - 1}` },
                { desc: "Simplify the coefficient and exponent.", math: finalTex }
            ],
            formulaTex: `\\frac{d}{dx}[ax^n] = (a \\cdot n)x^{n-1}`,
            variablesHtml: `<p><strong>a</strong>: Constant coefficient</p><p><strong>n</strong>: Exponent</p>`,
            simpleExp: "The derivative measures how fast the function is changing at any given point. We use the 'power rule' to quickly find this rate.",
            mathExp: "The derivative f'(x) represents the slope of the tangent line to the curve f(x) at any point x.",
            verificationHtml: "Integration of the result will yield the original function (+ C).",
            graphData: { type: 'derivative', f: (x_val) => a * Math.pow(x_val, n), label: `f(x) = ${a}x^${n}`, center: 0 },
            edu: {
                what: "The Power Rule is a quick way to find the derivative of a polynomial.",
                why: "Finding rates of change (like velocity from position).",
                real: "Physics, economics (marginal cost).",
                apps: "<li>Machine Learning (Gradient Descent)</li>",
                adv: "<li>Bypasses tedious limit definition.</li>",
                lim: "<li>Only applies to polynomials (not trig or exponential functions).</li>",
                mistakes: "<li>Forgetting to subtract 1 from the exponent.</li>",
                related: "<li>Integrals</li><li>Chain Rule</li>",
                practice: "Try a=3, n=4. (Answer: 12x³)"
            }
        };
    }

    // ==========================================
    // UI RENDERING ENGINE
    // ==========================================
    function renderResults(data) {
        ui.resultsArea.classList.remove('hidden');

        // 1. Final Answer
        renderKatex('res-final-answer', data.finalAnswerTex);

        // 2. Steps
        const container = document.getElementById('res-steps');
        container.innerHTML = '';
        data.steps.forEach((step, idx) => {
            const el = document.createElement('div');
            el.className = 'step-item';
            el.innerHTML = `<div class="step-number">${idx + 1}</div><div class="step-content"><div class="step-desc">${step.desc}</div><div class="step-math" id="math-step-${idx}"></div></div>`;
            container.appendChild(el);
            renderKatex(`math-step-${idx}`, step.math);
        });

        // 3-7. Explanations & Context
        renderKatex('res-formula', data.formulaTex);
        document.getElementById('res-variables').innerHTML = data.variablesHtml;
        document.getElementById('res-simple-exp').innerText = data.simpleExp;
        document.getElementById('res-math-exp').innerText = data.mathExp;
        document.getElementById('res-verification').innerHTML = data.verificationHtml;

        // Educational Section
        document.getElementById('edu-what').innerText = data.edu.what;
        document.getElementById('edu-why').innerText = data.edu.why;
        document.getElementById('edu-real').innerText = data.edu.real;
        document.getElementById('edu-apps').innerHTML = data.edu.apps;
        document.getElementById('edu-adv').innerHTML = data.edu.adv;
        document.getElementById('edu-lim').innerHTML = data.edu.lim;
        document.getElementById('edu-mistakes').innerHTML = data.edu.mistakes;
        document.getElementById('edu-related').innerHTML = data.edu.related;
        document.getElementById('edu-practice').innerText = data.edu.practice;

        // Graph Visualization
        const graphCard = document.getElementById('mathGraph').closest('.card');
        if (data.graphData) {
            graphCard.classList.remove('hidden');
            drawGraph(data.graphData);
        } else {
            graphCard.classList.add('hidden'); // Hide graph if not applicable (like Circle Area)
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
                    label: graphData.label,
                    data: yValues,
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2, tension: 0.4, fill: true, pointRadius: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor } }
                }
            }
        });
    }

    function toggleTheme() {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        ui.themeToggle.innerHTML = newTheme === 'light' ? '<i class="ph ph-moon"></i>' : '<i class="ph ph-sun"></i>';
        
        if (chartInstance) { // Trigger re-render of chart colors
            handleCalculate();
        }
    }
});
