import Head from "next/head";
import Script from 'next/script';
import { useState, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [firstQuestion, nextQuestion] = useState("");
  const [result, setResult] = useState();
  
  
  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({ question: firstQuestion }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);

      const myDiv1 = document.querySelector("#my-div");
      myDiv1.innerText = data.result.toString();

      MathJax.typesetPromise();

      nextQuestion("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  
  return (
    <div id="root">
      <Head>
        <title>Dubs</title>
        <link href="book-open-solid.svg" rel="icon"/>
      </Head>

      <Script src="https://polyfill.io/v3/polyfill.min.js?features=es6"/>
      <Script id="MathJax-script" defer async src="https://cdn.jsdelivr.net/npm/mathjax@3.0.1/es5/tex-mml-chtml.js"/>
      <Script src="https://kit.fontawesome.com/f6d4afe053.js" crossorigin="anonymous"/>

      <Script>
        {`
          MathJax = {
            tex: {
              inlineMath: [['$', '$'], ["\\(", "\\)"]],
              processEscapes: true,
            }
          }
        `}
      </Script>

      <main className={styles.main}>
        <i class="fa-solid fa-book-open fa-3x"></i>
        <h3>Dubs</h3>
        <p>NOTE***: When dealing with currency, repleace the dollar sign with an "@" e.g $70 = @70 </p>
        <p>LASTLY: If it gives you answers in a way you can't understand, just reload the page and try again.</p>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Enter a question"
            value={firstQuestion}
            onChange={(e) => nextQuestion(e.target.value)}
          />
          <input type="submit" value="Answers" />
        </form>
        <div id="my-div" className={styles.result}>
        </div>
      </main>
    </div>
  );
}
