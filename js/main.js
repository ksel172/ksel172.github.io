let blogStructure = {};

async function fetchBlogStructure() {
    console.log('Fetching blog structure...');
    const years = ['2024', '2023'];
    const months = ['12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02', '01'];

    for (const year of years) {
        blogStructure[year] = {};
        for (const month of months) {
            try {
                const url = `/ksel172.github.io/content/blogs/${year}/${month}/blogs.json`;
                console.log(`Fetching: ${url}`);
                const response = await fetch(url);
                if (response.ok) {
                    blogStructure[year][month] = await response.json();
                    console.log(`Loaded blogs for ${year}/${month}`);
                } else {
                    console.log(`No blogs found for ${year}/${month} (status: ${response.status})`);
                }
            } catch (error) {
                console.error(`Error fetching blogs for ${year}/${month}:`, error.message);
            }
        }
    }

    console.log('Final blog structure:', blogStructure);
    localStorage.setItem('blogStructure', JSON.stringify(blogStructure));
}

async function loadBlogList(page = 1, perPage = 10) {
    console.log('Loading blog list...');
    const blogList = document.getElementById('blogList');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    if (!blogList) {
        console.error('Blog list element not found!');
        return;
    }
    
    blogList.innerHTML = '';
    if (loadingIndicator) loadingIndicator.style.display = 'block';

    let allBlogs = [];
    for (const year in blogStructure) {
        for (const month in blogStructure[year]) {
            for (const blog of blogStructure[year][month]) {
                allBlogs.push({ year, month, blog });
            }
        }
    }

    console.log(`Total blogs found: ${allBlogs.length}`);

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const blogsToShow = allBlogs.slice(start, end);

    for (const { year, month, blog } of blogsToShow) {
        try {
            const url = `/ksel172.github.io/content/blogs/${year}/${month}/${blog}`;
            console.log(`Fetching blog: ${url}`);
            const response = await fetch(url);
            if (response.ok) {
                const blogData = await response.json();
                const blogItem = document.createElement('div');
                blogItem.className = 'blog-item';
                blogItem.innerHTML = `
                    <h2>${blogData.title}</h2>
                    <p class="date">${blogData.date}</p>
                    <button class="read-more" data-year="${year}" data-month="${month}" data-blog="${blog}">Read More</button>
                `;
                blogList.appendChild(blogItem);
                console.log(`Loaded blog: ${blogData.title}`);
            } else {
                console.error(`Error loading blog: ${year}/${month}/${blog}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error loading blog: ${year}/${month}/${blog}`, error);
        }
    }

    if (loadingIndicator) loadingIndicator.style.display = 'none';

    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', loadFullBlog);
    });

    updatePagination(page, Math.ceil(allBlogs.length / perPage));
}

function updatePagination(currentPage, totalPages) {
    console.log(`Updating pagination: currentPage=${currentPage}, totalPages=${totalPages}`);
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        console.error('Pagination element not found!');
        return;
    }
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => loadBlogList(i));
        if (i === currentPage) {
            pageButton.classList.add('current-page');
        }
        pagination.appendChild(pageButton);
    }
}

async function loadFullBlog(event) {
    const year = event.target.dataset.year;
    const month = event.target.dataset.month;
    const blog = event.target.dataset.blog;

    console.log(`Loading full blog: ${year}/${month}/${blog}`);

    try {
        const url = `/ksel172.github.io/content/blogs/${year}/${month}/${blog}`;
        console.log(`Fetching: ${url}`);
        const response = await fetch(url);
        if (response.ok) {
            const blogData = await response.json();
            const blogContent = document.getElementById('blogContent');
            if (!blogContent) {
                console.error('Blog content element not found!');
                return;
            }
            blogContent.innerHTML = `
                <h2>${blogData.title}</h2>
                <p class="date">${blogData.date}</p>
                <div class="content">${blogData.content}</div>
            `;
            blogContent.scrollIntoView({ behavior: 'smooth' });
            
            history.pushState(null, '', `?year=${year}&month=${month}&blog=${blog}`);
            console.log('Full blog loaded successfully');
        } else {
            console.error(`Error loading full blog: ${year}/${month}/${blog}. Status: ${response.status}`);
            showErrorMessage('Failed to load the blog post. Please try again later.');
        }
    } catch (error) {
        console.error(`Error loading full blog: ${year}/${month}/${blog}`, error);
        showErrorMessage('An error occurred while loading the blog post. Please try again later.');
    }
}

function showErrorMessage(message) {
    console.error(`Error message: ${message}`);
    const errorElement = document.getElementById('errorMessage');
    if (!errorElement) {
        console.error('Error message element not found!');
        return;
    }
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

async function initBlogLoader() {
    console.log('Initializing blog loader...');
    const cachedStructure = localStorage.getItem('blogStructure');
    if (cachedStructure) {
        console.log('Using cached blog structure');
        blogStructure = JSON.parse(cachedStructure);
    } else {
        console.log('Fetching new blog structure');
        await fetchBlogStructure();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const year = urlParams.get('year');
    const month = urlParams.get('month');
    const blog = urlParams.get('blog');

    if (year && month && blog) {
        console.log(`Loading specific blog: ${year}/${month}/${blog}`);
        loadFullBlog({ target: { dataset: { year, month, blog } } });
    } else {
        console.log('Loading blog list');
        await loadBlogList();
    }
}

document.addEventListener('DOMContentLoaded', initBlogLoader);