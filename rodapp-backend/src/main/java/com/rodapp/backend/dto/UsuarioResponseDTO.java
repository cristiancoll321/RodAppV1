package com.rodapp.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rodapp.backend.model.Usuario;
import jakarta.persistence.Column;

//Para enviar al cliente (sin enviar el passwordHash)
public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private Boolean estado;

    // Constructor desde entidad (el que usas en el controller)
    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.email = usuario.getEmail();
        this.estado = usuario.getEstado();
    }

    // Constructor vacío (NECESARIO para Jackson)
    public UsuarioResponseDTO() {
    }

    // GETTERS (OBLIGATORIOS - Jackson los usa para serializar)
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public Boolean getEstado() {
        return estado;
    }

    // SETTERS (opcionales pero buena práctica)
    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
