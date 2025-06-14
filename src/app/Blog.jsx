// import React, { useEffect, useState } from 'react';
// import TopHeader from '../assets/components/TopHeader';
// import MainHeader from '../assets/components/MainHeader';
// import { useBlog } from '../assets/context-api/blog-context/UseBlog';

// function Blog() {
//   const { blogs, categories, fetchBlogs, loading, error } = useBlog();
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [likes, setLikes] = useState({});
//   const [comments, setComments] = useState({});
//   const [commentInput, setCommentInput] = useState({});

//   useEffect(() => {
//     fetchBlogs(selectedCategory ? { category: selectedCategory } : {});
//     // eslint-disable-next-line
//   }, [selectedCategory]);

//   const handleLike = (id) => {
//     setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
//   };

//   const handleCommentChange = (id, value) => {
//     setCommentInput((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleAddComment = (id) => {
//     if (!commentInput[id]) return;
//     setComments((prev) => ({
//       ...prev,
//       [id]: [...(prev[id] || []), commentInput[id]]
//     }));
//     setCommentInput((prev) => ({ ...prev, [id]: '' }));
//   };

//   return (
//     <>
//       <TopHeader />
//       <MainHeader />
//       <div className="max-w-5xl mx-auto mt-8 px-4">
//         <h2 className="text-3xl font-bold mb-6 text-center">Our Blog</h2>
//         <div className="mb-6 flex flex-wrap gap-3 justify-center">
//           <button
//             className={`px-4 py-2 rounded ${selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
//             onClick={() => setSelectedCategory('')}
//           >
//             All
//           </button>
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               className={`px-4 py-2 rounded ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
//               onClick={() => setSelectedCategory(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//         {error && <div className="text-red-600 text-center mb-4">{error}</div>}
//         {loading ? (
//           <div className="text-center py-8">Loading...</div>
//         ) : blogs.length === 0 ? (
//           <div className="text-center text-gray-500 py-8">No blog posts found.</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {blogs.map((blog) => (
//               <div key={blog._id} className="bg-white rounded-lg shadow p-6 flex flex-col">
//                 {blog.image && (
//                   <img
//                     src={blog.image.startsWith('http') ? blog.image : `${import.meta.env.VITE_API_URL || ''}${blog.image}`}
//                     alt={blog.title}
//                     className="h-48 w-full object-cover rounded mb-4"
//                   />
//                 )}
//                 <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
//                 <div className="text-gray-600 text-sm mb-2">
//                   By {blog.author?.name || 'Unknown'} | {new Date(blog.createdAt).toLocaleDateString()}
//                 </div>
//                 <div className="mb-2">
//                   {blog.categories && blog.categories.map((cat) => (
//                     <span key={cat} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-2">
//                       {cat}
//                     </span>
//                   ))}
//                 </div>
//                 <p className="text-gray-800 mb-4 line-clamp-4">{blog.content}</p>
//                 <div className="flex items-center gap-4 mb-2">
//                   <button
//                     className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 text-sm"
//                     onClick={() => handleLike(blog._id)}
//                   >
//                     Like ({likes[blog._id] || 0})
//                   </button>
//                 </div>
//                 <div className="mb-2">
//                   <div className="font-semibold mb-1">Comments</div>
//                   <div className="space-y-2 mb-2">
//                     {(comments[blog._id] || []).map((c, idx) => (
//                       <div key={idx} className="bg-gray-100 rounded px-3 py-1 text-sm">{c}</div>
//                     ))}
//                   </div>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={commentInput[blog._id] || ''}
//                       onChange={e => handleCommentChange(blog._id, e.target.value)}
//                       className="flex-1 border rounded px-2 py-1"
//                       placeholder="Add a comment..."
//                     />
//                     <button
//                       className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
//                       onClick={() => handleAddComment(blog._id)}
//                       type="button"
//                     >
//                       Post
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default Blog;

import React, { useEffect, useState } from 'react';
import TopHeader from '../assets/components/TopHeader';
import MainHeader from '../assets/components/MainHeader';
import { useBlog } from '../assets/context-api/blog-context/UseBlog';
import { Link } from 'react-router-dom';

function Blog() {
  const { blogs, categories, fetchBlogs, loading, error } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchBlogs(selectedCategory ? { category: selectedCategory } : {});
    // eslint-disable-next-line
  }, [selectedCategory]);

  return (
    <>
      <TopHeader />
      <MainHeader />
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Blog</h2>
        <div className="mb-6 flex flex-wrap gap-3 justify-center">
          <button
            className={`px-4 py-2 rounded ${selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSelectedCategory('')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No blog posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow p-6 flex flex-col">
                <Link to={`/app/blogdetails/${blog._id}`} className="group">
                {blog.image && (
                  <img
                    src={blog.image.startsWith('http') ? blog.image : `${import.meta.env.VITE_API_URL || ''}${blog.image}`}
                    alt={blog.title}
                    className="h-48 w-full object-cover rounded mb-4"
                  />
                )}
                </Link>
                <Link to={`/app/blogdetails/${blog._id}`} className="group">
                    <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                </Link>
                <div className="text-gray-600 text-sm mb-2">
                  By {blog.author?.name || 'Unknown'} | {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <div className="mb-2">
                  {blog.categories && blog.categories.map((cat) => (
                    <span key={cat} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-2">
                      {cat}
                    </span>
                  ))}
                </div>
                <Link to={`/app/blogdetails/${blog._id}`} className="text-blue-600 hover:underline mb-4">
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Blog;