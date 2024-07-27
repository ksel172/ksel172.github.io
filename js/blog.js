// blog.js

const baseUrl = 'https://raw.githubusercontent.com/ksel172/ksel172.github.io/main/content/blogs/';

let allBlogs = [];
let currentPage = 1;
const blogsPerPage = 10;

async function fetchIndex(year, month) {
    const url = `${baseUrl}${year}/${month}/blogs-index.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching index for ${year}/${month}:`, error);
        return [];
    }
}

async function fetchAllBlogs(startYear, endYear) {
    let allBlogsData = [];

    for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
            const monthStr = month.toString().padStart(2, '0');
            const indexData = await fetchIndex(year, monthStr);
            allBlogsData = allBlogsData.concat(indexData);
        }
    }

    return allBlogsData;
}

async function displayBlogs() {
    const blogList = document.getElementById('blogList');
    const blogContent = document.getElementById('blogContent');

    blogList.innerHTML = '';
    blogContent.innerHTML = '';

    const start = (currentPage - 1) * blogsPerPage;
    const end = start + blogsPerPage;
    const blogsToDisplay = allBlogs.slice(start, end);

    for (const blog of blogsToDisplay) {
        try {
            const blogResponse = await fetch(`https://raw.githubusercontent.com/ksel172/ksel172.github.io/main/${blog.path}`);
            if (!blogResponse.ok) throw new Error(`Network response was not ok: ${blogResponse.statusText}`);
            const blogData = await blogResponse.json();

            const blogItem = document.createElement('div');
            blogItem.className = 'blog-item';
            blogItem.innerHTML = `
                <h2>${blogData.title}</h2>
                <p><em>${new Date(blogData.date).toDateString()}</em></p>
                <div>${blogData.content}</div>
            `;

            blogList.appendChild(blogItem);

            blogItem.addEventListener('click', () => {
                blogContent.innerHTML = `
                    <h1>${blogData.title}</h1>
                    <p><em>${new Date(blogData.date).toDateString()}</em></p>
                    <div>${blogData.content}</div>
                `;
            });
        } catch (error) {
            console.error('Fetch blog error:', error);
        }
    }

    updatePagination();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    pagination.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            displayBlogs();
        });
        pagination.appendChild(prevButton);
    }

    if (allBlogs.length > currentPage * blogsPerPage) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Load More';
        nextButton.addEventListener('click', () => {
            currentPage++;
            displayBlogs();
        });
        pagination.appendChild(nextButton);
    }
}

async function init() {
    const startYear = 2023;
    const endYear = 2024;
    allBlogs = await fetchAllBlogs(startYear, endYear);

    allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    displayBlogs();
}

init();
