const axios = require('axios');
const fs = require('fs');

function getLines(filename) {
    if (!fs.existsSync(filename)) {
        writeEmails("");
        return [];
    } else {
        let list = fs.readFileSync(filename)
        let lines = list.toString().split(/\r?\n/)
        return lines;
    }
}

function ping(ip, uid) {
    return new Promise((resolve, reject) => {
        axios.get(`http://${ip}:9002/incentivecash+uid:${uid}`).then(res => {
            resolve(res.data.response);
        }).then(err => {
            reject(err)
        })

    })
}

async function start() {
    console.log(new Date())
    let nodes = getLines('nodes.txt');
    for (let node of nodes) {
        let ip = node.split(":")[0];
        let uid = node.split(":")[1];
        let rewards = await ping(ip, uid);
        // console.log(rewards.details.rewards)
        console.log(`【${rewards.uid}】 LastPing: ${rewards.details.lastPing}`)
        console.log(rewards.details.rewards)
        console.log('----------')
    }
}
start();
setInterval(function () {
    start()
}, 60 * 60 * 1000);
