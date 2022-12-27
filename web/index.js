import ConvertApi from "./node_modules/convertapi-js/dist/convertapi.js";

const showFile = async function (e) {
  e.preventDefault();
  const ipfs = await window.IpfsCore.create();

  const fileObj = document.getElementById("inp");
  let file = fileObj.files[0];

  loader.style.visibility = "visible";
  const { path } = await ipfs.add(file);
  loader.style.visibility = "hidden";
  console.log(path);
  sessionStorage.setItem("hash", path);
};

const render = async function (hash) {
  loader.style.visibility = "visible";

  console.log(hash);
  const link = "https://gateway.ipfs.io/ipfs/" + hash;

  //converting tif to jpg
  let convertApi = ConvertApi.auth("sIr2qqA06vIeCkGC");
  let params = convertApi.createParams();
  params.add("file", new URL(link));
  let result = await convertApi.convert("tif", "jpg", params);

  //adding image to frontend
  const img = document.createElement("img");
  container.appendChild(img);
  console.log(result);
  const {
    dto: { Files },
  } = result;
  const [obj] = Files;
  const { Url } = obj;
  console.log(Url);
  img.src = Url;
  loader.style.visibility = "hidden";
};

//enroll hyperledger user
function createUserHyperledger(username) {
  loader.style.visibility = "visible";

  axios
    .post("http://localhost:4000/users", {
      username: username,
      orgName: "Org1",
    })
    .then(function (response) {
      console.log(response);
      const {
        data: { token },
      } = response;
      sessionStorage.setItem("token", token);
      const tkn = sessionStorage.getItem("token");
      loader.style.visibility = "hidden";

      alert(`Your Token is \n${tkn}`);
      console.log(tkn);
    })
    .catch(function (error) {
      console.log(error);
    });
}

/// retreiving from hyperledger

const retreiveFromHyperledger = async function (e) {
  e.preventDefault();
  container.innerHTML = "";
  const token = sessionStorage.getItem("token");
  const count = localStorage.getItem("count");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  for (let i = 1; i < count; i++) {
    axios
      .get(
        `http://localhost:4000/channels/mychannel/chaincodes/fabcar?args=["${i}"]&fcn=GetCarById`,
        config
      )
      .then(function (response) {
        console.log(response);
        const {
          data: {
            result: { make },
          },
        } = response;
        console.log(make);
        render(make);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};

//uploading to hyperledger
const uploadToHyperledger = async function () {
  const token = sessionStorage.getItem("token");
  const id = localStorage.getItem("count");
  const hash = sessionStorage.getItem("hash");
  console.log(id);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  axios
    .post(
      "http://localhost:4000/channels/mychannel/chaincodes/fabcar",
      {
        fcn: "CreateCar",
        chaincodeName: "fabcar",
        channelName: "mychannel",
        args: [
          `{"id":"${id}","make":"${hash}","addedAt":0,"model":"Null", "color":"Null","owner":"${token}"}`,
        ],
      },
      config
    )
    .then(function (response) {
      // handle success
      console.log(response);
      // const {
      //   data: {
      //     result: {
      //       result: { txid },
      //     },
      //   },
      // } = response;
      // sessionStorage.setItem("transcationId", txid);
      localStorage.setItem("count", Number(id) + 1);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

const query = function () {
  const hash = sessionStorage.getItem("hash");
  uploadToHyperledger();
};

const register = function () {
  let username = prompt("Enter Your User Name : ");
  console.log(username);
  if (username != null && username != "") createUserHyperledger(username);
  else register();
};

const settingUpToken = async function () {
  let token = prompt("Enter Your Token (Enter -1 if you don't have one)");
  console.log(token);
  if (token != null && token != "") {
    if (token == -1) {
      register();
    } else sessionStorage.setItem("token", token);
  } else settingUpToken();
};

const inp = document.getElementById("inp");
inp.addEventListener("change", showFile);

const submit = document.getElementById("submit");
submit.addEventListener("click", query);

const display = document.getElementById("display");
display.addEventListener("click", retreiveFromHyperledger);

const loader = document.getElementById("loader");
const container = document.querySelector(".img-container");

settingUpToken();
// retreiveFromHyperledger();
