import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../SideBar';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostLists = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/posts`, config);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/post/${postId}`, config);
      setPosts(posts.filter(post => post._id !== postId));
      toast.success('Post Deleted.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error Deleting Post.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
    }
    console.log(postId)
  };

  const handleEdit = (postId) => {
    console.log(`/admin/post/${postId}`);
    navigate(`/admin/post/${postId}`);
  };

  const handleCreate = () => {
    navigate('/admin/post/create');
  };

  return (
    <div style={styles.wrapper}>
      <SideBar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>All Posts</h2>
          <button onClick={handleCreate} style={styles.createButton}>Create</button>
        </div>

        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <div style={styles.postList}>
            {posts.map(post => (
              <div key={post._id} style={styles.postCard}>
                <h3>{post.name}</h3>
                <p>{post.description}</p>
                <div style={styles.images}>
                  {post.images.map((image, index) => (
                    <img key={index} src={image.url} alt={post.name} style={styles.image} />
                  ))}
                </div>
                <div style={styles.buttons}>
                  <button onClick={() => handleEdit(post._id)} style={styles.editButton}>Edit</button>
                  <button onClick={() => handleDelete(post._id)} style={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
  },
  container: {
    padding: '20px',
    flex: 1,
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  postList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  postCard: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    textAlign: 'left',
  },
  images: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  image: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  buttons: {
    marginTop: '10px',
  },
  editButton: {
    padding: '5px 10px',
    marginRight: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default PostLists;
