import react from "react";
import fs from "fs";

const Post = ({slug}) => {
    return <div>The slug for this page is {slug}</div>;
}

export async function getStaticPaths() {
    const files = fs.readdirSync('posts');
    console.log("files: ", files);
    const paths = files.map(fileName => ({ //suround this with ()?
        params: {
            slug: fileName.replace(".md", "")
        }
    }));
    console.log("paths: ", paths);

    return {
      paths,
      fallback: false
    };
  }

  export async function getStaticProps({params: {slug}}) {
    return {
      props: {slug}, // will be passed to the page component as props
    }
  }

export default Post;