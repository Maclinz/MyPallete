const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type=range]");
const slidersCon = document.querySelectorAll(".sliders");
const currentHex = document.querySelector(".color h2");
const hexName = document.querySelectorAll(".color h2");
const copyContainer = document.querySelector('.copy-container')
const popupText = document.querySelector('.copy-popup h3')
const ctlIcons = document.querySelectorAll('.controls button')
const settings = document.querySelectorAll('.color-adjust')
const closeBtn = document.querySelectorAll('.close-adjustments')
const lock = document.querySelectorAll('.lock-color');
let initialColors = [];

//Local Storage Object
let savedPalletes = [];


//Event Elisterns
sliders.forEach((slider) =>{
    slider.addEventListener('input', hslControls)
})

colorDivs.forEach((color, i) =>{
    color.addEventListener('change', () =>{
        updateText(i)
    })
})


settings.forEach((setting, index) =>{
    setting.addEventListener('click', () =>{
        openSliders(index)
    })
})

closeBtn.forEach((btn, index) =>{
    btn.addEventListener('click', () =>{
        closeSliders(index)
    })
})

lock.forEach((locker, index) =>{
    locker.addEventListener('click', () => {
        colorDivs[index].classList.toggle('locked')
        if(colorDivs[index].classList.contains('locked')){
            locker.innerHTML = '<i class="fi fi-sr-lock"></i>'
        }else{
            locker.innerHTML = '<i class="fi fi-sr-unlock"></i>'
        }
    })
})


hexName.forEach((hex) =>{
    hex.addEventListener('click', () =>{
        copyContainer.classList.add('active');
        copyContainer.style.backgroundColor = hex.innerText;

        const copyTexts = ['Paste Me!', 'Copied!', 'Already Copied!', 'Nice!', 'Okay!', 'Done!', 'Good Choice!', 'Right One!'];

        //random text from array
        const randomText = copyTexts[Math.floor(Math.random() * copyTexts.length)];

        popupText.innerText = randomText;

        //copyToClipBoard
        copyToClipBoard(hex)

        setTimeout(() =>{
            copyContainer.classList.remove('active')
        }, 1500)
    })
})

generateBtn.addEventListener('click', randomColors)

//generate a hex color
const generateHex = () =>{
    const hexColor = chroma.random();

    return hexColor;
}

//Loop through all the color divs and add event listeners
function randomColors(){

    //initials colors setup
    initialColors = []

    colorDivs.forEach((color, i) =>{
        const hexText = color.children[0]
        const randomColor = generateHex()

        if(color.classList.contains('locked')){
            initialColors.push(hexText.innerText)
            return;
        }else{
            //push the colors to the intial array
            initialColors.push(chroma(randomColor.hex()))
        }
        

        //add color to background
        color.style.backgroundColor = randomColor;
        hexText.innerHTML = randomColor;
        //check for contrast
        checkTextConrast(randomColor, hexText)
        
        //slider bg colors
        const inputBg = chroma(randomColor);
        const sliders = color.querySelectorAll('.sliders input')

        const hue = sliders[0]
        const brightness = sliders[1]
        const saturation = sliders[2]

        //colorize the siders bg
        colorizeSliders(inputBg, hue, brightness, saturation)
    })
    //Button Contrast
    settings.forEach((btn, index) =>{
        checkTextConrast(initialColors[index], btn)
        checkTextConrast(initialColors[index], lock[index])
    })
}

//chech text contast
function checkTextConrast(color, text){
    //returns a value between o- 1

    const luminance = chroma(color).luminance();
    if(luminance > 0.5){
        text.style.color = "black"
    }else{
        text.style.color = '#fff';
    }
}

//colorize sliders
const colorizeSliders = (color, hue, brightness, saturation) =>{
    //scale Saturation
    const notSat = color.set('hsl.s', 0)
    const fullSat = color.set('hsl.s', 1)
    const scaleSat = chroma.scale([notSat, color, fullSat])

    //scale Brightness
    const midBright = color.set('hsl.l', 0.5)
    const scaleBright = chroma.scale(["Black", midBright, "white"])

    //Sc

    //Update input bg colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`

    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`
}

//Input Manipulation
function hslControls(e) {
    const index = 
        e.target.getAttribute("data-brightness") ||
        e.target.getAttribute("data-saturation")||
        e.target.getAttribute("data-hue");
    
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]')

    const hue = sliders[0]
    const brightness = sliders[1]
    const saturation = sliders[2]

    //set bg color depending on input

    const bgColors = initialColors[index]

    //Modify current color based on input
    let color = chroma(bgColors)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);
    
    colorDivs[index].style.backgroundColor = color;

    //colorize sliders
    colorizeSliders(color, hue, brightness, saturation)
}

//uodate text
function updateText(i){
    const activeColor = colorDivs[i]
    //get bg color of current index
    const color = chroma(activeColor.style.backgroundColor)
    //get text
    const textHex = activeColor.querySelector('h2')
    //icons
    const icons = activeColor.querySelectorAll('.controls button')

    //convert color to hex using chroma
    textHex.innerText = color.hex();

    //check contrast
    checkTextConrast(color, textHex)

    //icons constrast
    for(icon of icons){
        //icon contrast
        checkTextConrast(color, icon)
    }
}

//copy colro to clip board
function copyToClipBoard(hex){
    const element = document.createElement('textarea')

    element.value = hex.innerText;
    document.body.appendChild(element)
    element.select()

    document.execCommand('copy')
    document.body.removeChild(element)
}


function openSliders(index){
    slidersCon[index].classList.toggle('active')
}

function closeSliders(index){
    slidersCon[index].classList.toggle('active')
}

randomColors()
