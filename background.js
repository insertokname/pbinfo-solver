
const problem_page = 'https://www.pbinfo.ro/probleme/';


function compare_solutions(first, second) {
    // how experienced an author is usually means the solution is better
    return parseInt(second.author.points) - parseInt(first.author.points);
}

async function get_problem_name(url) {
    const split = url.split('/')
    const problem_id = split[split.length - 2] // get the number code of the problem

    const response = await fetch(`https://www.pbinfo.ro/search.php?search_box=${problem_id}`)

    if (response.status != 200) {
        return null;
    }

    let problem_name_split = response.url.split('/');
    let problem_name = problem_name_split[problem_name_split.length - 1]
    return problem_name
}


async function get_solution(url) {
    let problem_name = await get_problem_name(url);

    if (!problem_name) {
        // error 5: try to access the problem page again
        return "eroare 5: incearca sa intrii iara pe problema..."
    }

    let response = await fetch("https://api.solinfo.ro/v2.0/endpoint/page/problema", {
        method: "POST",
        body: JSON.stringify({ name: problem_name }),
    })

    if (response.status != 200) {
        // error 1: it seems that solinfo isn't online 
        return `eroare 1: solinfo pare sa nu fie online`
    }


    let response_json = await response.json();
    if (response_json.success != true) {
        // error 2: error while searching for a solution on solinfo
        return `eroare 2: eroare in timp ce cautam solutii pe solinfo.`
    }

    let solutions = response_json.solutions.filter((solution) => solution.language == 'cpp').sort(compare_solutions);

    if (!solutions) {
        // the problem doesn't have solutions yet
        return "problema data nu are solutii inca ¯\\_(ツ)_/¯"
    }

    let solution_id = solutions[0].id;
    let solution_response = await fetch("https://api.solinfo.ro/v2.0/endpoint/page/problema-solutie", {
        method: "POST",
        body: JSON.stringify({ solutionId: solution_id }),
        credentials: 'omit'
    })

    if (solution_response.status != 200) {
        // error 3: failed to acces the solinfo solutions
        return "eroare 3: nu am reusit sa iau preiau solutia de pe solinfo"
    }


    let solution_response_json = await solution_response.json()
    if (solution_response_json.success != true) {
        // error 4: solution format is incorrect
        return "eroare 4: solutie formatata incorect!"
        // return `eroare 4: Nu a mers ceva in solinfo:\n${JSON.stringify(solution_response_json, null, 4)}`
    }

    return solution_response_json.content
}

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(problem_page)) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            func: () => {
                Editor.setValue("caut solutii...")
            },
            world: 'MAIN',
        });


        let solutions = await get_solution(tab.url)

        chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            func: (solutions) => {
                Editor.setValue(solutions)
            },
            args: [solutions],
            world: 'MAIN',
        });
    }
});
