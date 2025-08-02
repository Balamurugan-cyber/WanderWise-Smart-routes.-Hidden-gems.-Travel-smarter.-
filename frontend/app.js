const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".converter-grid .form-group select");
const btn = document.querySelector(".currency-converter .form-btn");
const fromCurr = document.querySelector(".fromCurrency select");
const toCurr = document.querySelector(".toCurrency select");
const msg = document.querySelector('.currency-card .amount')

window.addEventListener("load", () => {
    updateExchangeRate();
})

for(let select of dropdowns){
    for(currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.id === "fromCurrency" && currCode === "USD"){
            newOption.selected = "selected;"
        } else if(select.id === "toCurrency" && currCode === "INR"){
                   newOption.selected = "selected;"
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    })
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

const updateExchangeRate = async () => {
    let amount = document.querySelector(".currency-converter .form-group input");
    let amtVal = amount.value;
    if(amtVal == "" || amtVal<1){
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.min.json`;
    try{
        let response = await fetch(URL);
        let data = await response.json();
        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
        
        let finalAmount = (amtVal * rate).toFixed(4);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch(err){
        console.log(err);
        msg.innerText = "Something went wrong. Please try again later.";
    }
}