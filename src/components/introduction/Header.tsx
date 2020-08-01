import React from "react";

import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import * as React from "react";

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  container: {
    "max-width": "740px",
    color: "#FFFFFF",
  },
  headerText: {
    margin: "0px",
    "padding-bottom": "7px",
    "padding-left": "10px",
    "text-align": "left",
  },
  button: {
    padding: "15px 10px",
    margin: "0px 10px",
    color: "#FFFFFF",
    textTransform: "none",
  },
});

/**
 * 紹介画面のHeaderを表示する関数
 */
export const Header: React.FC = () => {
  /** CSSを用いたスタイル定義 */
  const classes = styles();
  return (
    <Container className={classes.container}>
      <Grid container direction="row">
        <Grid item xs={5}>
          <h1 className={classes.headerText}>Todos</h1>
        </Grid>
        <Grid item xs={3}>
          <Button className={classes.button}>Todosとは</Button>
        </Grid>
        <Grid item xs={2}>
          <Button className={classes.button}>出来ること</Button>
        </Grid>
        <Grid item xs={2}>
          <Button className={classes.button}>始めてみる</Button>
        </Grid>
      </Grid>
    </Container>
  );
};
