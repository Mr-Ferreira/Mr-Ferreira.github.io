let formula = ""
let parsedFormula = [""]
let parsedFormulaIndex = 0
let length = 0
let lastId = -1
let preFormula = ""

// trigger function that designates the formula set-up based on button input.
function read(event) {
    let trigger = event.srcElement.innerHTML
    formula = document.querySelector('#display').value
    length = formula.length
    if (length > 0)
        lastId = typeId(formula[length - 1])

    if (trigger == "C") 
        reset()
    else if (trigger == "⌫") {
        if (formula == "ERROR" || formula == "Infinity" || formula == "-Infinity")
            reset();
        else {
            formula = formula.slice(0, (length - 1));
            formula = fancy(formula);
            if (formula == "") 
                reset();
        }
    }
    else if (formula == "ERROR" || formula == "Infinity" || formula == "-Infinity") 
        return
    else if (trigger == "=") {
        length = formula.length
        let operationPresent = false;
        for (let i = 0; i < length; i++) {
            if (formula[i] == "e") {
                i++
                continue
            }
            if (typeId(formula[i]) == 0) {
                if (i == 0) 
                    continue
                operationPresent = true
            }   
        }
        let lastOperation = ""
        if (operationPresent == false) {
            let preFormulaLen = preFormula.length
            for (let i = preFormulaLen - 1; i >= 0; i--) {
                if (typeId(preFormula[i]) == 0) {
                    lastOperation = preFormula.slice(i)
                    break
                }
            }
            formula = formula + lastOperation
        }
        preFormula = formula
        parse(formula)
        formula = calculate(parsedFormula)
        formula = fancy(formula)
        let postFormula = formula
        if (preFormula != postFormula && formula != "ERROR") {
            appendHistory(preFormula)
            appendHistory("=" + postFormula)
        }
    }
    else if (trigger == "+/-") {
        if (formula == "0")
            formula = "(-";
        else if (formula == "(-")
            formula = "0";
        else {
            for (let i = length - 1; i >= 0; i--) {
                if (typeId(formula[i]) == 1 && i > 0) {
                    if (formula[i] == "%") 
                        formula = formula + "x(-";
                    else
                        continue;
                }
                else if (typeId(formula[i]) == 1)
                    formula = "(-" + formula;
                else if (i == (length - 1)){
                    if (formula[i] == ")") 
                        formula = formula + "x(-";
                    else if (formula[i] == "-" && i > 0) {
                        if (formula[i - 1] == "(")
                            formula = formula.slice(0, (i - 1));
                        else
                            formula = formula + "(-";
                    }
                    else
                        formula = formula + "(-";
                }
                else if (formula[i] == "-" && i > 0) {
                    if (formula[i - 1] == "e")
                            continue;
                    else if (formula[i - 1] == "(")
                        formula = formula.slice(0, (i - 1)) + formula.slice(i + 1);
                    else
                        formula = formula.slice(0, (i + 1)) + "(-" + formula.slice(i + 1);
                }
                else {
                    if (i - 1 >= 0) {
                        if (formula[i - 1] == "e")
                            continue;
                    }
                    formula = formula.slice(0, (i + 1)) + "(-" + formula.slice(i + 1);
                } 
                break;
            }
        }
    }
    
    else if (trigger == "( )") {
        let sumLeft = 0;
        let sumRight = 0;

        for (let i = 0; i < length; i++) {
            if (formula[i] == "(")
                sumLeft++;
            else if (formula[i] == ")")
                sumRight++;    
        }

        if (formula == "0") 
            formula = "(";
        else if (formula[length - 1] == "." && sumRight == sumLeft) 
            formula = formula.slice(0, length - 1) + "x(";
        else if (formula[length - 1] == "." && sumRight < sumLeft)
            formula = formula.slice(0, length - 1) + ")";
        else if (lastId != 0 && sumLeft == sumRight)
            formula = formula + "x(";
        else if (lastId == 0 && sumLeft == sumRight)
            formula = formula + "(";
        else if (lastId == 1)
            formula = formula + ")";
        else if (lastId == -1) {
            if (formula[length - 1] == ")")
                formula = formula + ")";
            else
                formula = formula + "(";
        }
        else if (lastId == 0) {
            formula = formula + "(";
        }  
    }
    else if (trigger == "%") {
        if (formula[length - 1] == ".")
            formula = formula.slice(0, (length - 1)) + trigger;
        if (length != 0 && lastId != 0 && formula[length - 1] != "%" && formula[length - 1] != "(")
            formula = formula + "%";
    }
    else if (trigger == ".") {
        if (lastId == 1 && formula[length - 1] != "%") {
            for (let i = length - 1; i >= 0; i--) {
                if (formula[i] == ".")
                    break;
                else if (typeId(formula[i]) == 1 && i == 0)
                    formula = formula + ".";
                else if (typeId(formula[i]) == 1)
                    continue;
                else {
                    if (i > 0) {
                        if (formula[i - 1] == "e")
                            break;
                    }
                    formula = formula + ".";
                    break;
                }
            }
        }
        else if (formula[length - 1] == ")" || formula[length - 1] == "%")
            formula = formula + "x0.";
        else if (formula[length - 1] != ".")
            formula = formula + "0.";
    }
    else if (typeId(trigger) == 0) {
        if (formula[length - 1] == "(") {
            formula = formula;
            if (lastId == -1 && length > 0 && trigger == "-")
                formula = formula + trigger;
        }
        else if (lastId == 0) {
            if ((trigger == "+" || trigger == "-") && formula[length - 2] == "(") {
                if (trigger == "+" && formula[length - 1] == "-")
                    formula = formula.slice(0, (length - 1));
                else
                    formula = formula.slice(0, (length - 1)) + trigger;
            }
            else if ((trigger == "÷" || trigger == "x") && formula[length - 2] == "(")
                formula = formula.slice(0, (length - 1));
            else
                formula = formula.slice(0, (length - 1)) + trigger;
        }
        else {
            if (formula[length - 1] == ".")
                formula = formula.slice(0, length - 1) + trigger;
            else if (formula[length - 1] == "(" && trigger == "+")
                return;
            else
                formula = formula + trigger;
        } 
    }
    else if (typeId(trigger) == 1 && length > 1 && (formula[length - 1] == "%" || formula[length - 1] == ")"))
        formula = formula + "x" + trigger
    else if (typeId(trigger) == 1){
        if (formula == "0" || formula == "ERROR")
            formula = trigger;
        else if (lastId == 0 && trigger == "0")
            formula = formula + trigger;
        else {
            let naturalNumOrDecimal = false;
            for (let i = length - 1; i >= 0; i--) {
                if (formula[i] == "." || parseInt(formula[i]) > 0){
                    naturalNumOrDecimal = true;
                    break;
                }
            }

            if (trigger == "0" && naturalNumOrDecimal == false && formula[length - 1] == "0")
                return;

            let digitCount = 0;
            let decDigitCount = 0;
            for (let i = length - 1; i >= 0; i--) {
                if (typeId(formula[i]) == 0) {
                    if (i > 0) {
                        if (formula[i - 1] != "e")
                            break;
                    }
                    else
                        break;
                }  
                else if (formula[i] == ".") {
                    decDigitCount = digitCount;
                    continue;
                }
                else if (formula[i] == ",")
                    continue;
                if (typeId(formula[i]) == 1)
                    digitCount++;
            }
            if (length > 1 && formula[length - 1] == "0" && typeId(formula[length - 2]) == 0 && trigger == "0")
                return;
            else if (length > 1 && formula[length - 1] == "0" && typeId(formula[length - 2]) == 0 && trigger != "0")
                formula = formula.slice(0, length - 1) + trigger;
            else if (digitCount < 15 && decDigitCount < 10)
                formula = formula + trigger;
        }
    }
    
    
    formula = fancy(formula)
    document.querySelector('#display').value = formula
    if (formula[length - 1] == "\n")
        lastId = typeId(formula[length - 2])
    else
        lastId = typeId(formula[length - 1])
    if (trigger == "=" || trigger == "C" || formula == "0")
        preCalc("=")
    else
        preCalc(formula)
}

// History container button functionalities
function calcHistory(event) {
    let trigger = event.srcElement.innerHTML
    if (trigger == "🔍") {
        document.getElementById('histContainer').style.display = "block"
        document.getElementById('calc').style.display = "none"
    }
    else if (trigger == "Clear") {
        let container = document.getElementById('listContainer')
        while (container.childElementCount > 0) 
            container.removeChild(container.children[0])
    }
    else {
        document.getElementById('histContainer').style.display = "none"
        document.getElementById('calc').style.display = "block"
    }
    
}

// Automatically shows a preview of the current calculation being typed
function preCalc (formula) {
    if (formula == "=") 
        formula = ""
    else {
        length = formula.length
        parse(formula)
        formula = calculate(parsedFormula)
        formula = fancy(formula)
        
    }
    document.querySelector('#answerDisplay').value = "= " + formula
    formula = "0"
    parsedFormula = [""]
    parsedFormulaIndex = 0
}

// Adds calculations to history container
function appendHistory (string) {
    let list = document.createElement("li")
    let text = document.createTextNode(string)
    let button = document.createElement("button")
    let container = document.getElementById('listContainer')

    button.setAttribute("id", "listedHistory")
    button.setAttribute("onclick", "useHistory(event);buttonClick(event);calcHistory(event);")

    button.appendChild(text)
    list.appendChild(button)
    container.appendChild(list)

    container.scrollTop = container.scrollHeight
}

function useHistory (event) {
    let trigger = event.srcElement.innerHTML
    if (trigger[0] == "=")
        formula = trigger.slice(1)
    else
        formula = trigger
    document.querySelector('#display').value = formula
}

function buttonClick(event) {
    event.srcElement.style.backgroundColor = "rgb(143, 143, 143)";
    let changeColorBack = setInterval(function () {
        event.srcElement.style.backgroundColor = "rgb(255, 255, 255)";
    }, 150);
}

//-------------------------------NON-MAIN FUNCTIONS-------------------------------


// Parses the formula to be later solved.
function parse (formula) {
    let parsedFormulaLen = parsedFormula.length;
    let length = formula.length
    for (let i = 0; i < length; i++) {
        if (typeId(formula[i]) == 1) {
            if (formula[i] == "%") {
                next()
                if (parsedFormula[parsedFormulaIndex - 1] == ")") {
                    parsedFormulaLen = parsedFormula.length;
                    let closedCount = 0;
                    let openIndex = -1;
                    for (let j = parsedFormulaLen - 1; j >= 0; j--) {
                        if (parsedFormula[j] == ")")
                            closedCount++;
                        else if (parsedFormula[j] == "(" && closedCount == 1) 
                            openIndex = j;
                        else if (parsedFormula[j] == "(") 
                            closedCount--;
                    }
                    parsedFormula.splice(openIndex, 0, "(");
                    parsedFormulaIndex++;
                }
                else {
                    next();
                    parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex - 1];
                    parsedFormula[parsedFormulaIndex - 1] = "(";
                    next();
                }
                parsedFormula[parsedFormulaIndex] = "/";
                next();
                parsedFormula[parsedFormulaIndex] = "100";
                next();
                parsedFormula[parsedFormulaIndex] = ")";
            }
            else if (formula[i] == ",") 
                continue;
            else if (formula[i] == "e") {
                parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex] + "e" + formula[i + 1];
                i++;
            }
            else if ((typeId(parsedFormula[parsedFormulaIndex]) == 1))
                parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex] + formula[i];
            else {
                next();
                parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex] + formula[i];
            }
        } 
        else {
            next();
            if (formula[i] == "x" && i < (length - 1))
                parsedFormula[parsedFormulaIndex] = "*";
            else if (formula[i] == "+" && i < (length - 1)) 
                parsedFormula[parsedFormulaIndex] = "+";
            else if (formula[i] == "-" && i < (length - 1)) 
                parsedFormula[parsedFormulaIndex] = "-";
            else if (formula[i] == "÷" && i < (length - 1))
                parsedFormula[parsedFormulaIndex] = "/";
            else if (formula[i] == "/" && i < (length - 1))
                parsedFormula[parsedFormulaIndex] = "/";
            else if (formula[i] == "(" && i < (length - 1)) 
                parsedFormula[parsedFormulaIndex] = "(";  
            else if (formula[i] == "(" && i == (length - 1)) {
                parsedFormula = "ERROR"
                return
            }  
            else if (formula[i] == ")") 
                parsedFormula[parsedFormulaIndex] = ")"; 
        } 
    }
    parsedFormulaLen = parsedFormula.length;
    for (let i = 0; i < parsedFormulaLen; i++) {
        parsedFormulaLen = parsedFormula.length;
        if (parsedFormula[i] == "/" && parsedFormula[i - 1] != ")" && parsedFormula[i + 1] != "(") {
            parsedFormula.splice((i - 1), 0, "(");
            if (i < (parsedFormulaLen - 2)) 
                parsedFormula.splice((i + 3), 0, ")");
            else 
                parsedFormula.push(")");
            i++; 
        }
    }
    let sumLeft = 0;
    let sumRight = 0;
    parsedFormulaLen = parsedFormula.length;
    for (let i = 0; i < parsedFormulaLen; i++) {
        if (parsedFormula[i] == "(")
            sumLeft++;
        else if (parsedFormula[i] == ")")
            sumRight++;    
    }
    while (sumLeft > sumRight) {
        parsedFormula.push(")");
        sumRight++;
    }
}

// Calculates the formula based on parsedFormula.
// Recall - PEMDAS.
function calculate (formula) {
    let length = formula.length;
    let calculation = 0;
    if (formula == "ERROR")
        return "ERROR"
    // Solve parentheses using recursion.
    let parenthesesSize = 0;
    for (let i = 0; i < length; i++) {
        if (formula[i] == "(") {
            let openCount = 1;
            let closedCount = 0;
            for (let j = i + 1; j < length; j++) {
                if (formula[j] == "(")
                    openCount++;
                else if (formula[j] == ")")
                    closedCount++;
                if (openCount == closedCount)  {
                    parenthesesSize = (j - i) + 1;
                    let localCalc = 0;
                    localCalc = calculate(formula.slice((i + 1), j));
                    if (localCalc == "ERROR")
                        return "ERROR";
                    formula.splice(i, parenthesesSize, localCalc);
                    length = formula.length;
                    break;
                }
            }
        }
    }

    // Solve multiplications and divisions.
    for (let i = 0; i < length; i++) {
        if ((formula[i] == "*" || formula[i] == "/") && i != (length - 1)) {
            let localCalc = 0;
            let num1 = parseFloat(precision(formula[i - 1]))
            let num2 = parseFloat(precision(formula[i + 1]))
            if (formula[i] == "*")
                localCalc = num1 * num2;
            else {
                if (num2 == 0)
                    return "ERROR";
                else
                    localCalc = num1 / num2;
            }
            localCalc = precision(localCalc.toString());
            formula.splice(i - 1, 3, localCalc);
            length = formula.length;
            i = i - 1;
        }
    }

    // Solve additions and subtractions.
    let sum = false;
    let sub = false;
    for (let i = 0; i < length; i++) {
        let num = parseFloat(precision(formula[i]))
        if (!isNaN(num)) {
            if (sum || i == 0) {
                calculation = calculation + num;
                sum = false;
            }
            else if (sub) {
                calculation = calculation - num;
                sub = false;
            }
            calculation = parseFloat(precision(calculation.toString()));
        }
        else if (formula[i] == "+") 
            sum = true;
        else if (formula[i] == "-") 
            sub = true; 
    }
    return precision(calculation.toString());
}

// Limits size of calculated numbers to 10 digits after the decimal,
// this is due to Javascript's floating point number innaccuracy.
// Limits size of calculated numbers to 15 digits total.
function precision(num) {
    if (num == "0")
        return num;

    // Counts number of digits after the decimal
    let dec = false;
    let digitCount = 0;
    let decDigitCount = 0;
    let nonZeroDecDigitCount = 0;
    let nonZeroIndex = -1;
    let tempNum = "";
    let decIndex = -1;
    let eIndex = -1;
    let length = num.length

    for (let i = 0; i < length; i++) {
        if (num[i] == ".") {
            dec = true;
            decIndex = i;
            continue;
        }
        if (!isNaN(parseInt(num[i])))
            digitCount++
        if (num[i] == "e") {
            eIndex = i;
            if (dec == false)
                return num;
            dec = false;
        }
        if (dec) {
            decDigitCount++;
            if (num[i] != "0" && nonZeroIndex == -1) 
                nonZeroIndex = i;
            if (nonZeroIndex != -1 && eIndex == -1)
                nonZeroDecDigitCount++;  
        }
        if (decDigitCount == 11 && dec) {
            if ((i + 1) > (length - 1)) 
                tempNum = num;
            else
                tempNum = num.slice(0, i + 1);
        }
    }

    let eQuantity = "";
    if (eIndex != -1) 
        eQuantity = num.slice(eIndex);
    
    if (tempNum != "") {
        if (parseInt(tempNum[tempNum.length - 1]) > 4){
            let newVal = tempNum.slice(nonZeroIndex)
            let preRoundLen = 0
            let postRoundLen = 0
            tempNum = tempNum.slice(0, (decIndex + 1))
            
            preRoundLen = newVal.length;
            newVal = parseInt(newVal) + 1;
            newVal = newVal.toString();
            postRoundLen = newVal.length;
    
            
            if (newVal.length > 11) {
                newVal = "";
                if (tempNum[0] == "-")
                    tempNum = parseInt(tempNum) - 1;
                else
                    tempNum = parseInt(tempNum) + 1;
                tempNum = tempNum.toString();
            }
            else if (postRoundLen > preRoundLen) {
                for (let i = 0; i < (decDigitCount - nonZeroDecDigitCount - 1); i++)
                    tempNum = tempNum + "0";
            }
            else {
                for (let i = 0; i < (decDigitCount - nonZeroDecDigitCount); i++)
                    tempNum = tempNum + "0";
            }
            num = tempNum + newVal + eQuantity;
        }   
        else 
            num = parseFloat(tempNum.slice(0, (tempNum.length - 1))) + eQuantity;
        num = num.toString();
    }

    if (decIndex != -1 && digitCount > 15 && eIndex == -1) {
        let i = length - 1
        while (digitCount > 15) {
            if (!isNaN(parseInt(num[i]))) {
                num = num.slice(0, (length - 1))
                length --
                digitCount--
            }
            else if (num[i] == ".")
                break;
            i--
        }
    }

    if (digitCount > 15 && eIndex == -1) {
        let negSign = false
        if (num[0] == "-") {
            negSign = true
            num = num.slice(1)
        }
        num = num.slice(0, 10)
        if (num[9] > 4) 
            num = parseInt(num.slice(0, 9)) + 1;
        else 
            num = parseInt(num.slice(0, 9))
        num = num.toString()
        num = num.slice(0, 1) + "." + num.slice(1) + "e+" + (digitCount - 1).toString()
        if (negSign == true)
            num = "-" + num
    }
    return num;
}

// Returns 0 if value is a mathematical operator 1 if it's a number and -1 if it's neither.
function typeId (value) {
    if (value != undefined) {
        if (value == "+/-")
            return lastId;
        if (!isNaN(parseFloat(value)) || value == "%" || value == "." || value == "," || value == "e")
            return 1;
        else if (value == ")" || value == "(")
            return -1
        else {
            let operators = ["x", "+", "-", "÷", "/"]
            let operatorsLen = operators.length;
            for (let i = 0; i < operatorsLen; i++) {
                if (value == operators[i])
                    return 0;
            }
            return -1;
        }
    }
    else
        return -1;
}

// Adds commas for every 3 integer digits, adds line breaks
function fancy (formula) {
    length = formula.length;
    if (formula[length - 1] == "\n") 
        formula = formula.slice(0, (length - 1));

    length = formula.length;
    let unbrokenChars = 0;
    for (let i = 0; i < length; i++) {
        if (formula[i] != "\n")
            unbrokenChars++;
        else
            unbrokenChars = 0;

        if (unbrokenChars > 22) {
            for (let j = i; j >= 0; j--) {
                if (typeId(formula[j]) == 0 || formula[j] == "(" || formula[j] == ")") {
                    if (j != 0) {
                        formula = formula.slice(0, j) + "\n" + formula.slice(j);
                        i--;
                        length++;
                        unbrokenChars = 0;
                        break;
                    }
                }
            }
        }
    }
    
    
    length = formula.length;
    let nonFancy = ""
    let newNumStartIndex = -1;
    let decIndex = -1;
    for (let i = 0; i < length; i++) {
        if (formula[i] != "," && decIndex == -1)
            nonFancy = nonFancy + formula[i];
        if (formula[i] == ".") {
            decInNum = true;
            nonFancy = nonFancy.slice(0, (nonFancy.length - 1));
            decIndex = i;
        }
        if (typeId(formula[i]) == 0 || formula[i] == ")" || formula[i] == "%" || formula[i] == "(") {
            decInNum = false;
            nonFancy = "";
            newNumStartIndex = i;
            decIndex = -1;
        } 
    }
    let nonFancyLen = nonFancy.length;
    

    if (nonFancyLen > 0 && nonFancy != "0" && formula != "ERROR" && formula != "Infinity" && formula != "-Infinity") {
        let fancy = "";
        for (let i = nonFancyLen - 4; i >= 0; i = i - 3) {
            if (i == nonFancyLen - 4) 
                fancy = "," + nonFancy.slice(i + 1) + fancy;
            else
                fancy = "," + nonFancy.slice(i + 1, i + 4) + fancy;
        }
            
        if (nonFancyLen % 3 == 2) 
            fancy = nonFancy.slice(0, 2) + fancy;
        if (nonFancyLen % 3 == 1)
            fancy = nonFancy[0] + fancy;
        if (nonFancyLen % 3 == 0)
            fancy = nonFancy.slice(0, 3) + fancy;

        if (newNumStartIndex == -1 && decIndex == -1) 
            formula = fancy;
        else if (decIndex != -1) 
            formula = formula.slice(0, (newNumStartIndex + 1)) + fancy + formula.slice(decIndex);
        else
            formula = formula.slice(0, (newNumStartIndex + 1)) + fancy;
    }
    return formula
}

// Resets the calculator
function reset () {
    formula = "0"
    parsedFormula = [""]
    parsedFormulaIndex = 0
    preFormula = ""
}

function next (){
    if (parsedFormula[parsedFormulaIndex] != "") {
        parsedFormula.push("");
        parsedFormulaIndex++;
    }
}
