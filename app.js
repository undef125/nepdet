import {
    provinceImg as provinceImgArr,
    districtImg as districtImgArr,
    districtImg,
} from "./pictureData.js";

const provinceWrapper = document.querySelector(".province-wrapper");
const provinceWrapperChild = document.querySelector(".province-holder");
const provinceTemplate = document.querySelector("template");
const heading = document.querySelector(".heading");
const pagers = document.querySelectorAll(".naving > div");
let wrapperObj = {};
let provinceStack = [];

pagers[0].classList.add("inactive");
pagers[1].classList.add("inactive");
pagers[2].classList.add("inactive");

//event listener to pagers
pagers[0].addEventListener("click", renderProvince);

async function fetchUrl(url) {
    return await axios.get(url);
}

function goBackToDistrict() {
    pagers[2].classList.remove("active");
    let prov = provinceStack.pop();
    renderDistrict(prov, '3');
}

function getCities(disName) {
    provinceWrapperChild.removeEventListener("click", toRenderCities);
    let toReturnArr = [];
    let provInce;
    fetchUrl("./province.json").then((response) => {
        for (const prov in response.data) {
            for (const dis of response.data[prov]) {
                if (dis.district === disName) {
                    toReturnArr = [...dis.cities];
                    provInce = prov
                }
            }
        }
        renderCities(toReturnArr,disName,provInce);
    });
}

function renderCities(cities,disName,province,checkk) {
    pagers[1].addEventListener("click", goBackToDistrict);
    pagers[2].classList.add("active");
    pagers[1].classList.remove("active");
    provinceWrapperChild.innerHTML = "";
    heading.textContent = `${disName}: Cities`;
    for (const city of cities) {
        let toAppend = document.importNode(provinceTemplate.content, true);
        let wrapper = toAppend.querySelector(".template-wrapper");
        let h2 = toAppend.querySelector(".name");
        // let img = toAppend.querySelector("img");
        // img.src = provinceImgArr[i];
        // i++;
        h2.textContent = city;
        provinceWrapperChild.append(toAppend);
    }
}


function toRenderCities() {
        let selectedDistrict = event.target.closest("div").parentNode.lastElementChild.textContent;
        getCities(selectedDistrict);
}

function renderDistrict(provinceName) {
    // let i = 0;
    provinceStack.push(provinceName);
    provinceWrapperChild.removeEventListener("click", toRenderDistricts);   //one-dead
    pagers[0].classList.remove("active");
    pagers[1].classList.add("active");
    provinceWrapperChild.innerHTML = "";
    heading.textContent = `${provinceName}: Districts`;
    for (const district in wrapperObj[provinceName]) {
        let toAppend = document.importNode(provinceTemplate.content, true);
        let wrapper = toAppend.querySelector(".template-wrapper");
        let h2 = toAppend.querySelector(".name");
        //     let img = toAppend.querySelector("img");
        //     img.src = provinceImgArr[i];
        // i++;
        h2.textContent = district;
        provinceWrapperChild.append(toAppend);
    }
    provinceWrapperChild.addEventListener('click', toRenderCities);
}

function managingData() {
    fetchUrl("./province.json").then((response) => {
        for (const prov in response.data) {
            let obj = {};
            for (const dis of response.data[prov]) {
                Object.assign(obj, { [dis.district]: dis.cities });
            }
            Object.assign(wrapperObj, { [prov]: obj });
        }
        renderProvince();
    });
}


function renderProvince() {
    provinceWrapperChild.removeEventListener('click', toRenderCities);
    provinceWrapperChild.innerHTML = "";
    let i = 0;
    pagers[0].classList.add("active");
    pagers[1].classList.remove("active");
    pagers[2].classList.remove("active");
    heading.textContent = "Provinces";
    for (const prov in wrapperObj) {
        let toAppend = document.importNode(provinceTemplate.content, true);
        let wrapper = toAppend.querySelector(".template-wrapper");
        let h2 = toAppend.querySelector(".name");
        let img = toAppend.querySelector("img");
        img.src = provinceImgArr[i];
        i++;
        h2.textContent = prov;
        provinceWrapperChild.append(toAppend);
    }
    provinceWrapperChild.addEventListener("click", toRenderDistricts);   //one
}

function toRenderDistricts() {
    let selectedProvince = event.target.closest("div").parentNode.lastElementChild.textContent;
    if(selectedProvince.toString().length < 20) {
        renderDistrict(selectedProvince);
    } else {
        console.log("boom");
    }
}

managingData();