import React from "react";
import ReactDOM from "react-dom";

import Header from "./Header.js";
import Footer from "./Footer.js";

import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  top: {
    backgroundColor: "#33DFEA",
    margin: "0px",
    border: "opx",
  },
  container: {
    "max-width": "740px",
    color: "#FFFFFF",
  },
  topText: {
    "text-align": "center",
    margin: "30px 0px",
    "font-weight": "300",
  },
  button: {
    left: "38%",
    padding: "5px 10px",
    margin: "30px",
    color: "#FFFFFF",
    background: "#EDC124",
    "text-align": "center",
  },
  bottom: {
    backgroundColor: "#FFFFFF",
  },
});

interface IIntroductionContentProps {
  Login: () => void;
}

/**
 * 紹介画面の内容を表示する関数
 * @param {Object} props Google認証にまつわるものが格納されている
 * @param {function} props.Login - Google認証を行う関数
 */
export const Content: React.FC<IIntroductionContentProps> = (props) => {
  /** CSSを用いたスタイル定義 */
  const classes = styles();
  return (
    <Box>
      <Box className={classes.top}>
        <Header />
        <Container className={classes.container}>
          <Grid container direction="column">
            <Grid item>
              <h1 className={classes.topText}>
                大学の課題と
                <br />
                楽しく付き合おう
                <br />
                そんな手助けをするアプリ
              </h1>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                className={classes.button}
                onClick={props.Login}
              >
                始めてみる
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.bottom}>
        <Footer />
      </Box>
    </Box>
  );
};
