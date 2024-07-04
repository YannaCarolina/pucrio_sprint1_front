const backendUrl = 'http://127.0.0.1:5000/api/pets/';

document.addEventListener('DOMContentLoaded', function () {
    fetch(backendUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                document.getElementById('noCadastrosMessage').style.display = 'none';
            }
            data.forEach(pet => {
                addCadastroCard(pet);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar pets:', error);
        });

    document.getElementById('cadastroForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const owner = document.getElementById('owner').value;
        const breed = document.getElementById('breed').value;
        const frequency = document.getElementById('frequency').value;
        const health_info = document.getElementById('health_info').value;
        const obs = document.getElementById('obs').value;

        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, age, owner, breed, frequency, health_info, obs })
        })
            .then(response => response.json())
            .then(data => {
                addCadastroCard(data);
                document.getElementById('cadastroForm').reset();
            })
            .catch(error => {
                console.error('Erro ao cadastrar pet:', error);
            });
    });
});

function addCadastroCard(pet) {
    const cadastroCard = document.createElement('div');
    cadastroCard.className = 'card cadastro-card';

    const cadastroInfo = document.createElement('div');
    cadastroInfo.className = 'cadastro-info';
    cadastroInfo.innerHTML = `
        <p><strong>Nome:</strong> <span class="name">${pet.name}</span></p>
        <p><strong>Idade:</strong> <span class="age">${pet.age}</span></p>
        <p><strong>Dono:</strong> <span class="owner">${pet.owner}</span></p>
        <p><strong>Raça:</strong> <span class="breed">${pet.breed}</span></p>
        <p><strong>Frequência:</strong> <span class="frequency">${pet.frequency}</span></p>
        <p><strong>Informações de Saúde:</strong> <span class="health_info">${pet.health_info}</span></p>
        <p><strong>Observações:</strong> <span class="obs">${pet.obs}</span></p>
    `;

    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container';

    const editIcon = document.createElement('span');
    editIcon.className = 'edit-icon';
    editIcon.innerHTML = '✏️';

    editIcon.addEventListener('click', function () {
        if (editIcon.innerHTML === '✏️') {
            const nameSpan = cadastroInfo.querySelector('.name');
            const ageSpan = cadastroInfo.querySelector('.age');
            const ownerSpan = cadastroInfo.querySelector('.owner');
            const breedSpan = cadastroInfo.querySelector('.breed');
            const frequencySpan = cadastroInfo.querySelector('.frequency');
            const healthInfoSpan = cadastroInfo.querySelector('.health_info');
            const obsSpan = cadastroInfo.querySelector('.obs');

            nameSpan.innerHTML = `<input type="text" value="${nameSpan.textContent}" class="edit-name">`;
            ageSpan.innerHTML = `<input type="number" value="${ageSpan.textContent}" class="edit-age">`;
            ownerSpan.innerHTML = `<input type="text" value="${ownerSpan.textContent}" class="edit-owner">`;
            breedSpan.innerHTML = `<input type="text" value="${breedSpan.textContent}" class="edit-breed">`;
            frequencySpan.innerHTML = `<input type="text" value="${frequencySpan.textContent}" class="edit-frequency">`;
            healthInfoSpan.innerHTML = `<input type="text" value="${healthInfoSpan.textContent}" class="edit-health_info">`;
            obsSpan.innerHTML = `<input type="text" value="${obsSpan.textContent}" class="edit-obs">`;

            editIcon.innerHTML = '💾';
        } else {
            const editNameInput = cadastroInfo.querySelector('.edit-name');
            const editAgeInput = cadastroInfo.querySelector('.edit-age');
            const editOwnerInput = cadastroInfo.querySelector('.edit-owner');
            const editBreedInput = cadastroInfo.querySelector('.edit-breed');
            const editFrequencyInput = cadastroInfo.querySelector('.edit-frequency');
            const editHealthInfoInput = cadastroInfo.querySelector('.edit-health_info');
            const editObsInput = cadastroInfo.querySelector('.edit-obs');

            const newName = editNameInput.value;
            const newAge = editAgeInput.value;
            const newOwner = editOwnerInput.value;
            const newBreed = editBreedInput.value;
            const newFrequency = editFrequencyInput.value;
            const newHealthInfo = editHealthInfoInput.value;
            const newObs = editObsInput.value;

            fetch(`${backendUrl}${pet.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName,
                    age: newAge,
                    owner: newOwner,
                    breed: newBreed,
                    frequency: newFrequency,
                    health_info: newHealthInfo,
                    obs: newObs
                })
            })
                .then(response => response.json())
                .then(data => {
                    cadastroInfo.querySelector('.name').textContent = data.name;
                    cadastroInfo.querySelector('.age').textContent = data.age;
                    cadastroInfo.querySelector('.owner').textContent = data.owner;
                    cadastroInfo.querySelector('.breed').textContent = data.breed;
                    cadastroInfo.querySelector('.frequency').textContent = data.frequency;
                    cadastroInfo.querySelector('.health_info').textContent = data.health_info;
                    cadastroInfo.querySelector('.obs').textContent = data.obs;
                    editIcon.innerHTML = '✏️';
                })
                .catch(error => {
                    console.error('Erro ao editar pet:', error);
                });
        }
    });

    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'delete-icon';
    deleteIcon.innerHTML = '🗑️';

    deleteIcon.addEventListener('click', function () {
        fetch(`${backendUrl}${pet.id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    cadastroCard.remove();
                    checkCadastros();
                } else {
                    throw new Error('Erro ao deletar pet');
                }
            })
            .catch(error => {
                console.error('Erro ao deletar pet:', error);
            });
    });

    iconContainer.appendChild(editIcon);
    iconContainer.appendChild(deleteIcon);

    cadastroCard.appendChild(cadastroInfo);
    cadastroCard.appendChild(iconContainer);

    document.getElementById('cadastros').appendChild(cadastroCard);

    checkCadastros();
}

function checkCadastros() {
    const cadastros = document.getElementById('cadastros');
    const noCadastrosMessage = document.getElementById('noCadastrosMessage');

    if (cadastros.getElementsByClassName('cadastro-card').length === 0) {
        noCadastrosMessage.style.display = 'block';
    } else {
        noCadastrosMessage.style.display = 'none';
    }
}

checkCadastros();
