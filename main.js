const fs = require('fs');
const path = require('path');

fs.readFile('./mag.csv', 'utf-8', (err, res) => {
    if (err) return console.log(err.message);

    let data = [];
    let dataProcessed = [];
    res.split('\r\n').forEach(item => {
        let tempArr = item.split(',');
        let tempObj = {
            id: tempArr[0],
            mag: parseFloat(tempArr[1])
        }
        data.push(tempObj);
    })

    let container = [];
    let currentId = data[0].id;
    data.forEach(item => {
        if (item.id == currentId) container.push(item.mag);
        else {
            let tempObj = {
                id: currentId,
                mag: calcMean(container)
            }
            dataProcessed.push(tempObj);
            currentId = item.id;
            container = [];
            container.push(item.mag);
        }
    })

    fs.readFile('./score.csv', 'utf-8', (err, res) => {
        if (err) return console.log(err.message);
        let data2 = [];
        res.split('\r\n').forEach(item => {
            let tempArr = item.split(',');
            let tempObj = {
                id: tempArr[0],
                score: parseFloat(tempArr[1])
            }
            data2.push(tempObj);
        })

        let dataProcessed2 = [];
        data2.forEach(item => {
            for (const item2 of dataProcessed) {
                if (item2.id == item.id) {
                    let tempObj = {
                        ...item2,
                        score: item.score
                    }
                    dataProcessed2.push(tempObj);
                }
            }
        })

        fs.writeFile(path.join(__dirname, 'output.csv'), dataStringify(dataProcessed2), 'utf-8', (err, res) => {
            if (err) return console.log('文件写入失败' + err.message);
            console.log('文件写入成功');
        })
    })
})

const calcMean = arr => {
    let sum = 0;
    arr.forEach(item => {
        sum += item;
    })
    return sum / arr.length;
}

const dataStringify = data => {
    let output = '';
    const dataKeys = Object.keys(data[0]);
    data.forEach(item => {
        for (let i = 0; i < dataKeys.length; i++) {
            output += item[dataKeys[i]];
            if (i >= dataKeys.length - 1) output += '\n';
            else output += ','
        }
    })

    return output;
}