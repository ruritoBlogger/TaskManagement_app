import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import firebase from "../firebase";

import { makeStyles } from "@material-ui/styles"; // eslint-disable-line @typescript-eslint/no-unused-vars
import Button from "@material-ui/core/Button"; // eslint-disable-line @typescript-eslint/no-unused-vars
import Grid from "@material-ui/core/Grid"; // eslint-disable-line @typescript-eslint/no-unused-vars
import Container from "@material-ui/core/Container"; // eslint-disable-line @typescript-eslint/no-unused-vars
import SettingsButton from "@material-ui/icons/Settings"; // eslint-disable-line @typescript-eslint/no-unused-vars
import Menu from "@material-ui/core/Menu"; // eslint-disable-line @typescript-eslint/no-unused-vars
import MenuItem from "@material-ui/core/MenuItem"; // eslint-disable-line @typescript-eslint/no-unused-vars

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  root: {
    "min-height": "75px",
    backgroundColor: "#33DFEA",
  },
  container: {
    "max-width": "1200px",
    color: "#FFFFFF",
  },
  headerText: {
    margin: "0px",
    "padding-bottom": "7px",
    "padding-left": "10px",
    "text-align": "left",
  },
  logo_button: {
    "min-height": "65px",
    "font-size": "35px",
    padding: "0px",
    color: "#FFFFFF",
    textTransform: "none",
  },
  button: {
    "min-height": "65px",
    "font-size": "20px",
    padding: "15px 10px",
    color: "#FFFFFF",
    textTransform: "none",
  },
});

/**
 * ログイン後のページのHeaderを表示する関数
 */
export const Header: React.FC = () => {
  /** setting部分のMenuがOpenかそうでないかを管理している */
  const [anchorEL, setAnchorEL] = useState(null);
  /** CSSを用いたスタイル定義 */
  const classes = styles();
  /** 画面遷移を担当 */
  const history = useHistory();

  /**
   * settingがクリックされた時に発火する
   * MenuをOpenにする
   */
  function handleClick(event: React.MouseEvent<HTMLInputElement>): void {
    setAnchorEL(event.currentTarget);
  }

  /**
   * settingがOpenの時に、setting以外の部分をクリックされた時に発火する
   * MenuをCloseにする
   */
  function handleClose(): void {
    setAnchorEL(null);
  }

  /**
   * MenuがOpenの時にログアウトボタンがクリックされた時に発火する
   * ログアウトを行い紹介画面に遷移させる
   * MenuをCloseにする
   */
  function Logout(): void {
    handleClose();
    firebase.auth().signOut();
    history.push("/");
  }

  /**
   * Logoボタンをクリックされた時に発火する
   * ホームページに遷移する
   */
  function MoveHomePage(): void {
    history.push("/main");
  }

  /**
   * 時間割ボタンをクリックされた時に発火する
   * 時間割ページに遷移する
   */
  function MoveSchedulePage(): void {
    history.push("/schedule");
  }

  /**
   * Todoボタンをクリックされた時に発火する
   * Todoページに遷移する
   */
  function MoveTodoPage(): void {
    history.push("/todo");
  }

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Container item xs={8} className={classes.container}>
        <Grid container direction="row">
          <Grid item xs={6}>
            <Button onClick={MoveHomePage} className={classes.logo_button}>
              Todos
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={MoveSchedulePage} className={classes.button}>
              時間割
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={MoveTodoPage} className={classes.button}>
              todo
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={handleClick} className={classes.button}>
              <SettingsButton />
            </Button>
            <Menu
              anchorEl={anchorEL}
              keepMounted
              open={Boolean(anchorEL)}
              onClick={handleClose}
            >
              <MenuItem onClick={handleClose}>Twitter連携</MenuItem>
              <MenuItem onClick={handleClose}>Google連携</MenuItem>
              <MenuItem onClick={Logout}>ログアウト</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};
