const Ipfs = require("it-to-buffer");

const showFile = async function () {
  //   e.preventDefault();
  // const fileObj = document.getElementById("inp");
  //   console.dir(`my method : ${fileObj}`);
  //   let file = fileObj.files[0];
  // const txt = "hello siddhesh";
  // const { cid } = await ipfs.add(txt);
  // console.log(cid);
  // const buffer = await toBuffer(ipfs.cat(cid));
  // const newtxt = buffer.toString();
  // console.log(newtxt, "newnewnew");
  //   console.log(file);

  ///
  const ipfs = await Ipfs.create();
  const results = await ipfs.add("hi my name is siddhesh");
  console.log(results);
  const buffer = await ipfs.cat(results.path);
  const result = await toBuffer(buffer);
  const final = result.toString();
  console.log(final);
  // const cid = results[0].hash;
  // console.log("CID created via ipfs.add:", cid);
  // const data = await node.cat(cid);
  // console.log("Data read back via ipfs.cat:", new TextDecoder().decode(data));
};

const render = function (e) {
  e.preventDefault();
  const file = JSON.parse(sessionStorage.getItem("file"));
  if (file) {
  }
};
