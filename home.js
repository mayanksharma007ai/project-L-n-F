// this loads the posts on the home page
document.addEventListener('DOMContentLoaded', function() {
    // check if user is logged in
    if (auth.isLoggedIn()) {
        // show my posts button
        document.getElementById('myPostsBtn').style.display = 'block';
    }
    
    // run this when page laods
    loadAllPosts();
});

// gets all posts from the server
async function loadAllPosts() {
    try {
        const response = await fetch('https://l-f-backend-i8np.onrender.com//api/items');
        const posts = await response.json();
        
        // split posts into lost and found
        const lostPosts = posts.filter(post => post.category === 'lost');
        const foundPosts = posts.filter(post => post.category === 'found');
        
        // show them on the page
        displayPosts(lostPosts, 'lostPostsContainer');
        displayPosts(foundPosts, 'foundPostsContainer');
        
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        document.getElementById('lostPostsContainer').innerHTML = '<p>Failed to load posts. Please try again later.</p>';
        document.getElementById('foundPostsContainer').innerHTML = '<p>Failed to load posts. Please try again later.</p>';
    }
}

// puts posts on the page
function displayPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    
    if (posts.length === 0) {
        container.innerHTML = '<p>No items posted yet.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
        // use default image if no image
        const imageUrl = post.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
        
        // get today's date
        const postDate = new Date().toLocaleDateString();
        
        postCard.innerHTML = `
            <div class="post-image">
                <img src="${imageUrl}" alt="${post.itemName}">
            </div>
            <div class="post-content">
                <h3>${post.itemName}</h3>
                <p>${post.description}</p>
                <div class="post-meta">
                    <span class="location">${post.location}</span>
                    <span class="date">${postDate}</span>
                </div>
                <button href="tel:${post.phoneNumber}" class="btn btn-small">Contact (${post.phoneNumber})</button>
            </div>
        `;
        
        container.appendChild(postCard);
    });
}

// shows posts with delete button (for my posts)
function displayPostsWithDelete(posts, containerId) {
    const container = document.getElementById(containerId);
    
    if (posts.length === 0) {
        container.innerHTML = '<p>You haven\'t posted anything yet.</p>';
        return;
    }
    
    container.innerHTML = ''; 
    
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
        // use default image if no image
        const imageUrl = post.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
        
        // get today's date
        const postDate = new Date().toLocaleDateString();
        
        postCard.innerHTML = `
            <div class="post-image">
                <img src="${imageUrl}" alt="${post.itemName}">
            </div>
            <div class="post-content">
                <h3>${post.itemName}</h3>
                <p>${post.description}</p>
                <div class="post-meta">
                    <span class="location">${post.location}</span>
                    <span class="date">${postDate}</span>
                </div>
                <div class="post-actions">
                    <button class="btn btn-small" onclick="deletePost(${post.id})">Delete</button>
                    <button class="btn btn-small">Edit</button>
                </div>
            </div>
        `;
        
        container.appendChild(postCard);
    });
}

// deletes a post
async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    try {
        const response = await fetch(`https://l-f-backend-i8np.onrender.com//api/delete-post/${postId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Post deleted successfully!');
            loadMyPosts();
        } else {
            alert('Failed to delete post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
    }
}

// uploads user avatar
async function uploadAvatar(input) {
    const file = input.files[0];
    if (!file) return;
    
    // check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image too large! Please choose an image smaller than 5MB.');
        return;
    }
    
    // check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    
    try {
        // show loading
        const avatar = document.querySelector('.user-avatar');
        const originalSrc = avatar.src;
        avatar.src = 'https://via.placeholder.com/40x40?text=...';
        
        // upload to cloudinary
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('https://l-f-backend-i8np.onrender.com//api/upload-avatar', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // update avatar using auth system
            auth.updateAvatar(data.avatarUrl);
            
            alert('Profile picture updated!');
        } else {
            // restore original avatar
            avatar.src = originalSrc;
            alert('Failed to upload image. Please try again.');
        }
    } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Error uploading image. Please try again.');
    }
}

// switches between lost, found, and my posts tabs
function showSection(sectionName) {
    const lostSection = document.getElementById('lostSection');
    const foundSection = document.getElementById('foundSection');
    const myPostsSection = document.getElementById('myPostsSection');
    const lostBtn = document.getElementById('lostBtn');
    const foundBtn = document.getElementById('foundBtn');
    const myPostsBtn = document.getElementById('myPostsBtn');
    
    // hide all sections first
    lostSection.classList.remove('active');
    foundSection.classList.remove('active');
    myPostsSection.classList.remove('active');
    lostBtn.classList.remove('active');
    foundBtn.classList.remove('active');
    myPostsBtn.classList.remove('active');
    
    if (sectionName === 'lost') {
        lostSection.classList.add('active');
        lostBtn.classList.add('active');
    } else if (sectionName === 'found') {
        foundSection.classList.add('active');
        foundBtn.classList.add('active');
    } else if (sectionName === 'myPosts') {
        myPostsSection.classList.add('active'); 
        myPostsBtn.classList.add('active');
        loadMyPosts(); // load user's posts
    }
}

// shows my posts section
function showMyPosts() {
    showSection('myPosts');
}

// loads user's own posts
async function loadMyPosts() {
    if (!auth.isLoggedIn()) {
        alert('Please login to view your posts');
        return;
    }
    
    try {
        const response = await fetch(`https://l-f-backend-i8np.onrender.com/api/user-posts?email=${auth.getCurrentUser().Email}`);
        const posts = await response.json();
        
        displayPostsWithDelete(posts, 'myPostsContainer');
    } catch (error) {
        console.error('Failed to fetch my posts:', error);
        document.getElementById('myPostsContainer').innerHTML = '<p>Failed to load your posts. Please try again later.</p>';
    }
}

