function setEditor(val) {
    chrome.runtime.sendMessage({ action: 'setEditor', value: val });
}


async function getEditor() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'getEditor' }, (response) => {
            resolve(response);
        });
    });
}

async function getSolutionIds() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'getSolutionIds' }, (response) => {
            resolve(response);
        });
    });
}

async function getSolutionContent(id) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'getSolutionContent', id: id }, (response) => {
            resolve(response);
        });
    });
}


async function make_buttons() {
    if (typeof pageSolutionList === 'undefined') {
        var pageSolutionList = ["///     Codul tau original:\n" + await getEditor(), "caut solutii..."];
    }

    if (typeof solinfoIter === 'undefined') {
        var solinfoIter = 1;
    }

    setEditor(pageSolutionList[solinfoIter])

    const btnSubmit = document.getElementById('btn-submit');
    const parentElement = btnSubmit.parentNode.parentNode.parentNode;
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    nextButton.textContent = 'next';
    nextButton.className = 'btn btn-primary';
    nextButton.id = 'solinfo-next';
    nextButton.onclick = async () => {
        if (solinfoIter < pageSolutionList.length - 1) {
            solinfoIter++;
        }
        else {
            solinfoIter = pageSolutionList.length - 1;
        }

        nextButton.disabled = (solinfoIter >= (pageSolutionList.length - 1));
        prevButton.disabled = (solinfoIter <= 0);

        if (typeof pageSolutionList[solinfoIter] == "number") {
            setEditor("se incarca urmatoarea solutie...")
            nextButton.disabled = true;
            pageSolutionList[solinfoIter] = await getSolutionContent(pageSolutionList[solinfoIter]);
            nextButton.disabled = false;
        }

        nextButton.disabled = (solinfoIter >= (pageSolutionList.length - 1));
        prevButton.disabled = (solinfoIter <= 0);


        setEditor(pageSolutionList[solinfoIter])

    };


    prevButton.textContent = 'prev';
    prevButton.className = 'btn btn-primary';
    prevButton.id = 'solinfo-prev';
    prevButton.onclick = async () => {
        if (0 < solinfoIter) {
            solinfoIter--;
        }
        else {
            solinfoIter = 0;
        }
        nextButton.disabled = (solinfoIter >= (pageSolutionList.length - 1));
        prevButton.disabled = (solinfoIter <= 0);

        setEditor(pageSolutionList[solinfoIter]);
    };

    const hideExtensionButton = document.createElement('button');
    hideExtensionButton.textContent = 'ascunde extensia';
    hideExtensionButton.className = 'btn btn-primary';
    hideExtensionButton.id = 'solinfo-hide';
    hideExtensionButton.onclick = () => {
        let existing_div = parentElement.querySelector("#solinfo-btn-div");
        parentElement.removeChild(existing_div)

    };

    const div = document.createElement('div');
    div.id = 'solinfo-btn-div'
    div.className = "right";

    div.appendChild(prevButton);
    div.appendChild(nextButton);
    div.appendChild(hideExtensionButton);

    let existing_div = parentElement.querySelector("#solinfo-btn-div");
    if (!existing_div) {
        parentElement.appendChild(div)
    }

    nextButton.disabled = (solinfoIter >= (pageSolutionList.length - 1));
    prevButton.disabled = (solinfoIter <= 0);

    let solution_ids = await getSolutionIds();
    console.log("IDS:" + solution_ids)
    pageSolutionList.pop();
    solution_ids.forEach(solution_id => {
        pageSolutionList.push(solution_id);
    });

    pageSolutionList[solinfoIter] = await getSolutionContent(pageSolutionList[solinfoIter]);

    setEditor(pageSolutionList[solinfoIter])

    nextButton.disabled = (solinfoIter >= (pageSolutionList.length - 1));
    prevButton.disabled = (solinfoIter <= 0);
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "init") {
        make_buttons();
    }
});