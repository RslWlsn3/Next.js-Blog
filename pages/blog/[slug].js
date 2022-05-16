import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

//Template part of our static site generation
const Post = ({ htmlString, data }) => {
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta title="description" content={data.description} />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    </>
  );
};

//nextjs func
export const getStaticPaths = async () => {
  const files = fs.readdirSync("posts");
  console.log("files: ", files);
  const paths = files.map(filename => ({
    params: {
      //name of this file: page name
      slug: filename.replace(".md", "")
    }
  }));
  console.log("paths: ", paths);

  return {
    paths,
    fallback: false
  };
};

//nextjs func
//fetch content of the post
//this function gets passed a Context parameter which includes a params key (from getStaticPaths)

export const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMetadata = fs
    .readFileSync(path.join("posts", slug + ".md"))
    .toString();

  const parsedMarkdown = matter(markdownWithMetadata); //grab meta data from md

  const html = await unified() //grad md and convert to html
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify)
  .process(parsedMarkdown.content);

  const htmlString = html.toString();
  
  return {
    props: { // props obj will be passed to the page component (Post) as props
      htmlString,
      data: parsedMarkdown.data
    }
  };
};

export default Post;