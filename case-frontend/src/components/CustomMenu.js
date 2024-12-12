import { useState, forwardRef } from "react";
import {
  Slide,
  MenuItem,
  Button,
  Menu,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CustomMenu({ children, elements }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const mappedElements = elements.map((el, index) => {
    return (
      <div key={`menu-item-wrapper-${index}`}>
        <MenuItem
          key={`menu-item-${index}`}
          onClick={() => {
            el.isModal ? el.onClickOpenModal() : el.onClick();
            !el.isModal && handleClose();
          }}
          disabled={el.disabled}
        >
          {el.name}
        </MenuItem>
        {el.isModal && (
          <Dialog
            key={`dialog-${index}`}
            fullScreen={el.fullscreen}
            open={el.modalOpened}
            onClose={el.onClickCloseModal}
            TransitionComponent={Transition}
          >
            {el.fullscreen && (
              <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                      handleClose();
                      el.onClickCloseModal();
                    }}
                    aria-label="close"
                  >
                    <Close />
                  </IconButton>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    {el.modalName}
                  </Typography>
                  {!!el.onClick && (
                    <Button
                      autoFocus
                      color="inherit"
                      onClick={() => {
                        el.onClick();
                        el.onClickCloseModal();
                        handleClose();
                      }}
                    >
                      Download Report
                    </Button>
                  )}
                </Toolbar>
              </AppBar>
            )}
            <>{el.modalContent}</>
          </Dialog>
        )}
      </div>
    );
  });
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={[{"&:hover": {backgroundColor: "#2563EB"}}, {"color": "white"}]}
      >
        {children}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
        {mappedElements}
      </Menu>
    </div>
  );
}

export default CustomMenu;
