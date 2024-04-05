import React from 'react'
import styles, { layout } from '../style';

const DragDropImageUploader = () => {
  return (
    <section >
   <div className='flex'>
    <div className={`flex justify-center align-center pt-6`}>

      
<div className='top flex justify-center w-[600px] p-2 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-purple-400 focus:outline-none cta-block'>
    <p className='font-raleway font-normal text-[18px] leading-[32px] text-white my-10 p-4'>Drag & Drop Artwork Upload</p>


<div className='drag-area p-2'>
    <span className={`${styles.paragraph} max-w-[470px] m-4 select`}>Drop image here</span><br></br>
Drag & drop image here or {" "}
<span className='select'>
  Browse
</span>

<input name="file" type="file" className=''/>

</div>

</div>

    </div>
    <div className={`${styles.flexCenter} flex-col form-wrapper profile-posts`}>


    <div className="input-wrapper m-4">
<input name="title" type="text" placeholder='Artwork Title...' className="input-text" required/>
</div>
<div className="input-wrapper">
<textarea name="description" type="text" placeholder='Artwork Description...' className="input-text mt-6 "/>
</div>

</div>

</div>
<div className='container-image-upload'>
  <div className='thumbnail-upload'>
    <span className='delete'>&times;</span>
  </div>
<img src="" alt="" />
</div>
   
<div className={`flex justify-center align-center py-8`}>
<button type='button' className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-full`}>Upload</button>
</div>




{/* <div className="form-wrapper profile-posts">
                    
                    <form className="signup-form" action="includes/gallery-upload.inc.php" method="post" enctype="multipart/form-data">
                    <div className="input-wrapper">
                        <input type="text" name="filename" placeholder="File name..." className="input-text"></input>
                        </div>
                        <div className="input-wrapper">
                        <input type="text" name="filetitle" placeholder="Image title..." className="input-text"></input>
                        </div>
                        <div className="input-wrapper">
                        <input type="text" name="filedesc" placeholder="Image Description..." className="input-text"></input>
                        </div>
                        <div className="input-wrapper">
                        <input type="file" name="file" className="add-artwork"></input>
                        <button type="submit" name="submit" className="header-login-a">UPLOAD</button>
                        </div>
                      
                    </form>
                    </div> */}

    </section>
  )
}

export default DragDropImageUploader