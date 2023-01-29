/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Lobsang Tenzin Student ID: 103895215 Date: 01/29/2023
*
********************************************************************************/ 

let page = 1
const perPage = 10

const loadData = async (title = null) => {
    const pagination = document.querySelector('.pagination')

    try {
        const url = title ? `https://drab-gold-pronghorn.cyclic.app/api/movies?page=1&perPage=50&title=${title}` : `https://drab-gold-pronghorn.cyclic.app/api/movies?page=${page}&perPage=${perPage}`

        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }
        const movies = await res.json()

        //check pagination
        title ? pagination.classList.add("d-none") : pagination.classList.remove("d-none")

        //render html
        renderData(movies.data)
    }
    catch (error) {
        console.log(`Could not get data: ${error}`);

        //render error message
        const html = `<p class="error-msg">Could not find any data, please try again</p>`
        document.getElementById('movie-table').innerHTML = ``
        document.getElementById('message').innerHTML = html
        pagination.classList.add("d-none")
    }
}

const renderData = (data) => {
    let render = ""
    for (let i = 0; i < data.length; i++) {
        const html = `
        <tr id=${data[i]._id} class="data-row">
            <td>${data[i].year}</td>
            <td>${data[i].title}</td>
            <td>${data[i].plot ? data[i].plot : "N/A"}</td>
            <td>${data[i].rated ? data[i].rated : "N/A"}</td>
            <td>${Math.floor(data[i].runtime / 60)}:${(data[i].runtime % 60).toString().padStart(2, '0')}</td>
        </tr>
        `
        render += html
    }
    document.getElementById('movie-table').innerHTML = render

    //add handler to each row
    document.querySelectorAll('.data-row').forEach(element => {
        element.addEventListener('click', handleClick)
    })
}

const prevPage = () => {
    if (page > 1) {
        page--
        loadData()
        document.getElementById('current-page').innerText = page
    }

    if (page === 1) {
        document.getElementById('prev-page-btn').classList.add("disabled");
    }
}

const nextPage = () => {
    page++
    loadData()
    document.getElementById('prev-page-btn').classList.remove("disabled");
    document.getElementById('current-page').innerText = page
}

const handleClick = (event) => {
    const id = event.currentTarget.id
    findMovie(id)
}

const findMovie = async (id) => {
    try {
        const res = await fetch(`https://drab-gold-pronghorn.cyclic.app/api/movies/${id}`)
        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }
        const movie = await res.json()

        //call modal control
        modalControl(movie.data)
    }
    catch (error) {
        console.log(`Could not get data: ${error}`);
    }
}

const modalControl = (data) => {
    document.querySelector('.modal-title').innerText = data.title

    //render html
    const html = `
        <img class="img-fluid w-100" src=${data.poster} alt="movie poster"><br><br>
        <strong>Directed By:</strong> ${data.directors.join(", ")}<br><br>
        <p>${data.fullplot ? data.fullplot : "N/A"}</p>
        <strong>Cast:</strong> ${data.cast ? data.cast.join(", ") : "N/A"}<br><br>
        <strong>Awards:</strong> ${data.awards.text ? data.awards.text : "N/A"}<br>
        <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
    `
    document.querySelector('.modal-body').innerHTML = html

    //control modal
    let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
        backdrop: 'static',
        keyboard: false,
        focus: true,
    });
    myModal.show();
}

const handleSubmit = (event) => {
    event.preventDefault()
    const title = document.getElementById('searchForm').elements[0].value
    loadData(title)
}

const handleClear = () => {
    document.getElementById('searchForm').reset()
    loadData()
}

document.addEventListener("DOMContentLoaded", () => {
    //loading page
    loadData()
    document.getElementById('current-page').innerText = page

    //switching pages
    document.getElementById('previous-page').addEventListener('click', prevPage)
    document.getElementById('next-page').addEventListener('click', nextPage)

    //search movie
    document.getElementById('submitForm').addEventListener('click', handleSubmit)
    document.getElementById('clearForm').addEventListener('click', handleClear)
})
