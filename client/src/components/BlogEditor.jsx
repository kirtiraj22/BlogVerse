import React from "react";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/PageAnimation";
import logo from "../images/logo.png"
import defaultBanner from "../images/banner.png"
const BlogEditor = () => {
    const handleBannerUpload = (e) => {
        console.log(e)
        let img = e.target.files[0]
        console.log(img)
    }
	return (
		<>
			<nav className="navbar">
				<Link to="/" className="flex-none w-10 ">
					<img src={logo} />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full">
					New Blog
				</p>

				<div className="flex gap-4 ml-auto">
					<button className="btn-dark py-2">Publish</button>
					<button className="btn-light py-2">Save Draft</button>
				</div>
			</nav>
			<AnimationWrapper>
				<section>
					<div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
                            <label htmlFor="uploadBanner">
                                <img 
                                    src={defaultBanner}
                                    className="z-20"

                                />
                                <input type="file" 
                                id="uploadBanner"
                                accept=".png, .jpg, .jpeg"
                                hidden
                                onChange={handleBannerUpload}
                                />
                            </label>
                        </div>
                    </div>
				</section>
			</AnimationWrapper>
		</>
	);
};

export default BlogEditor;
