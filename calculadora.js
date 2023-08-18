let stack = [0];
let isResult = false;
let lastOp = '';

const highPriorityOperationSigns = ['*', '/'];
const lowPriorityOperationSigns = ['+', '-'];
const operationSigns = highPriorityOperationSigns + lowPriorityOperationSigns;

const cleanStack = () => {
    stack = [0];
    updateDisplayNumber(0);
    removeActionButtonClass(lastOp);
}
const isAnOperationSign = value => operationSigns.includes(value);
const isFloatNumber = value => value.toString().includes('.');
const updateDisplayNumber = number => document.getElementById('number-display').innerHTML = number;
const setActionButtonClass = operation => {
    switch (operation) {
        case '+':
            document.getElementById('add-op').classList.add('action-button-active');
            break;
        case '-':
            document.getElementById('sub-op').classList.add('action-button-active');
            break;
        case '*':
            document.getElementById('mult-op').classList.add('action-button-active');
            break;
        case '/':
            document.getElementById('div-op').classList.add('action-button-active');
            break;
        default:
            return;
    }
}

const removeActionButtonClass = operation => {
    switch (operation) {
        case '+':
            document.getElementById('add-op').classList.remove('action-button-active');
            break;
        case '-':
            document.getElementById('sub-op').classList.remove('action-button-active');
            break;
        case '*':
            document.getElementById('mult-op').classList.remove('action-button-active');
            break;
        case '/':
            document.getElementById('div-op').classList.remove('action-button-active');
            break;
        default:
            '';
    }
}

const removeLargeResultClass = () => document.getElementById('number-display').classList.remove('large-result');

const pushOp = value => {
    isResult = false;
    removeActionButtonClass(lastOp);
    
    const lastStackIndex = stack.length-1
    const lastStackValue = stack[lastStackIndex];

    if (isAnOperationSign(lastStackValue)) {
        stack.splice(lastStackIndex, 1, value);
    } else {
        if (highPriorityOperationSigns.includes(lastOp)) {
            result();
            isResult = false;
        }

        stack.push(value);
    }

    setActionButtonClass(value);
    lastOp = value;
};

const pushNumber = value => {
    const lastStackIndex = stack.length-1;
    const lastStackValue = stack[lastStackIndex];

    if (isResult) {
        isResult = false;
        stack = [0];
    }
    
    removeLargeResultClass();

    if (!isFloatNumber(stack[0]) && stack.length === 1 || isAnOperationSign(lastStackValue)) {
        stack.push(value); 
    } else {
        value = lastStackValue + '' + value;
        stack.splice(lastStackIndex, 1, value);
    }

    updateDisplayNumber(value);
    removeActionButtonClass(lastOp);
}

const pushPoint = () => {
    const lastStackIndex = stack.length-1;
    const lastStackValue = stack[lastStackIndex];

    if (isFloatNumber(lastStackValue)) {
        return;
    }

    isResult = false;

    if (isAnOperationSign(lastStackValue)) {
        value = 0 + '.'
        stack.push(value);
        removeLargeResultClass();
    } else {
        value = lastStackValue + '.';
        stack.splice(lastStackIndex, 1, value);
    }

    updateDisplayNumber(value);
}

const pushPercent = () => {
    isResult = false;
    const lastStackIndex = stack.length-1;
    const lastStackValue = stack[lastStackIndex];

    if (isAnOperationSign(lastStackValue)) {
        return;
    }

    const result = lastStackValue/100;
    stack.splice(lastStackIndex, 1, result);
    
    updateDisplayNumber(result);
}

const pushSignal = () => {
    isResult = false;
    const lastStackIndex = stack.length-1;
    const lastStackValue = stack[lastStackIndex];

    if (isAnOperationSign(lastStackValue)) {
        return;
    }

    const result = -lastStackValue;
    stack.splice(lastStackIndex, 1, result);
    updateDisplayNumber(result);
}

const calculate = () => {
    let op = '';
    stack.forEach(value => {
        if (value < 0 && op.endsWith('-')) {
            value = '('+value+')';
        }

        op = op.concat(value)
    });

    return eval(op);
}

const result = () => {
    if (stack[0] == 0 && !isAnOperationSign(stack[1])) {
        stack.splice(0, 1);
    }

    let result = calculate();
    
    if (result.toString().includes('.') && result.toString().length > 9) {
        result = result.toString().slice(0, 10);
        document.getElementById('number-display').classList.add('large-result');
    }

    stack = [result];
    isResult = true;
    removeActionButtonClass(lastOp);
    lastOp = '';
    updateDisplayNumber(result);
}