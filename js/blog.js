// blog.js
const BASE_URL = 'https://raw.githubusercontent.com/ksel172/ksel172.github.io/main/content/blogs/';
const BLOGS_PER_PAGE = 10;
let currentPage = 1;
let allBlogs = [];
let totalBlogs = 0;
let filteredBlogs = [];

async function fetchRootIndex() {
    try {
        const response = await fetch(`${BASE_URL}blogs-index.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching root index:', error.message);
        return null;
    }
}

async function fetchBlogData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching blog data from ${url}:`, error.message);
        return null;
    }
}

async function fetchAllBlogs() {
    const rootIndex = await fetchRootIndex();
    if (!rootIndex) return;

    for (const [year, months] of Object.entries(rootIndex)) {
        for (const [month, blogs] of Object.entries(months)) {
            for (const blog of blogs) {
                const blogData = await fetchBlogData(blog.url);
                if (blogData) {
                    allBlogs.push({
                        ...blog,
                        ...blogData
                    });
                }
            }
        }
    }

    allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    totalBlogs = allBlogs.length;
    filteredBlogs = [...allBlogs];
    displayBlogs();
    populateTagFilter();
}

function displayBlogs() {
    const blogList = document.getElementById('blogList');
    blogList.innerHTML = '';

    const start = (currentPage - 1) * BLOGS_PER_PAGE;
    const end = start + BLOGS_PER_PAGE;
    const blogsToDisplay = filteredBlogs.slice(start, end);

    blogsToDisplay.forEach(blog => {
        const blogItem = document.createElement('div');
        blogItem.className = 'blog-item';

        const htmlPath = blog.htmlPath || '#';

        blogItem.innerHTML = `
        <article class="blog-item">
            <img src="${blog.image || 'placeholder.jpg'}" alt="${blog.title}" class="blog-image">
            <div class="blog-details">
                <div class="blog-header">
                    <h2 class="blog-title">${blog.title}</h2>
                    <p class="blog-meta">
                        ${new Date(blog.date).toLocaleDateString()} :: ${blog.author || 'Unknown Author'}
                    </p>
                    <p class="blog-tags">
                        ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
                    </p>
                </div>
                <div class="blog-footer">
                    <a href="${htmlPath}" class="read-more" aria-label="Read more about ${blog.title}">READ MORE &gt;</a>
                </div>
            </div>
        </article>
    `;
      
    
        blogList.appendChild(blogItem);
    });

    updatePagination();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayBlogs();
        };
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        pagination.appendChild(pageButton);
    }
}

function populateTagFilter() {
    const tagFilter = document.getElementById('tagFilter');
    const allTags = new Set(allBlogs.flatMap(blog => blog.tags));
    
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

function filterBlogs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedTag = document.getElementById('tagFilter').value;

    filteredBlogs = allBlogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm) || 
                              blog.excerpt.toLowerCase().includes(searchTerm);
        const matchesTag = selectedTag === '' || blog.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    currentPage = 1;
    displayBlogs();
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', filterBlogs);
document.getElementById('tagFilter').addEventListener('change', filterBlogs);

// Initialize
fetchAllBlogs();