import React, { useState } from "react"
import { useHistory } from "react-router-dom"

import firebase from "../firebase"

import { makeStyles } from "@material-ui/styles"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Container from "@material-ui/core/Container"
import Icon from "@material-ui/core/Icon"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

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
    "padding-left" : "10px",
    "text-align": "left",
  },
  logo_button: {
    "min-height": "65px",
    "font-size": "35px",
    "padding" : "0px",
    color: "#FFFFFF",
  },
  button: {
    "min-height": "65px",
    "font-size": "20px",
    "padding" : "15px 10px",
    color: "#FFFFFF",
  }
})

/**
 * ログイン後のページのHeaderを表示する関数
 */
export default function Header() {

  /** setting部分のMenuがOpenかそうでないかを管理している */
  const [anchorEL, setAnchorEL] = useState(null)
  /** CSSを用いたスタイル定義 */
  const classes = styles()
  /** 画面遷移を担当 */
  const history = useHistory()

  /**
   * settingがクリックされた時に発火する
   * MenuをOpenにする
   */
  function handleClick(event) {
    setAnchorEL(event.currentTarget)
  }

  /**
   * settingがOpenの時に、setting以外の部分をクリックされた時に発火する
   * MenuをCloseにする
   */
  function handleClose() {
    setAnchorEL(null)
  }

  /**
   * MenuがOpenの時にログアウトボタンがクリックされた時に発火する
   * ログアウトを行い紹介画面に遷移させる
   * MenuをCloseにする
   */
  function Logout() {
    handleClose()
    firebase.auth().signOut()
    history.push("/")
  }

  /**
   * Logoボタンをクリックされた時に発火する
   * ホームページに遷移する
   */
  function MoveHomePage() {
    history.push("/main")
  }

  /**
   * 時間割ボタンをクリックされた時に発火する
   * 時間割ページに遷移する
   */
  function MoveSchedulePage() {
    history.push("/schedule")
  }

  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <Container item xs={8} className={classes.container}>
        <Grid container direction="row">
          <Grid item xs={6}>
            <Button onClick={MoveHomePage} className={classes.logo_button}>Logo</Button>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={MoveSchedulePage} className={classes.button}>時間割</Button>
          </Grid>
          <Grid item xs={2}>
            <Button className={classes.button}>todo</Button>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={handleClick} className={classes.button}><Icon>settings</Icon></Button>
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
  )
}