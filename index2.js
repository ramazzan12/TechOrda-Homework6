function destroyPopup(popup) {
    popup.remove();
}

function ask({title, cancel}) {
    return new Promise (resolve => {
        
        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.classList.add('open');

        popup.insertAdjacentHTML(
            'afterbegin',
            `<form action="/action_page.php">
            <label>${title}</label>
            <input type="file" id="myFile" name="filename"/>
            <button type="submit">Submit</button>
            </form>`
        );

        if(cancel) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';
            popup.appendChild(cancelBtn);

            cancelBtn.addEventListener('click', () => {
                destroyPopup(popup);
            }, {once: true})
        }

        popup.addEventListener('submit', e => {
            if (!e.target.filename.value) {
                window.alert('You did not submit');
                e.preventDefault();
            } else {
                e.preventDefault();
                const inputFile = e.target.filename.value;
                resolve(inputFile);
                destroyPopup(popup);
            }
            
        });

        document.body.appendChild(popup);
    })
}

const questions = [
    {
        title: 'Upload first file',
        cancel: true
    },
    {
        title: 'Upload second file',
        cancel: true
    },
    {
        title: 'Upload third file',
        cancel: true
    },
    {
        title: 'Upload last file',
        cancel: true
    }
];

async function askMany() {
    for (const question of questions) {
        await ask(question);
    }
}
askMany();