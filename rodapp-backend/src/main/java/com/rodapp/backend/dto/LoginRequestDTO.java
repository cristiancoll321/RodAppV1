package com.rodapp.backend.dto;

public class LoginRequestDTO {

    private String email;
    private String password;  // Contraseña plana para verificar

    //Get y Set

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
