package com.rodapp.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table
public class Motocicleta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;


    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String modelo;

    @Column(unique = true, nullable = true)
    private String placa;
    private Integer cilindrada;
    private String tipoCombustible;
    private String color ;
    private Double kmActual;

    @JsonManagedReference
    @OneToMany(mappedBy = "motocicleta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DocumentoLegal> documentos = new ArrayList<>();




    public Motocicleta() {
    }

    public Motocicleta(Long id, Double kmActual, String color, String tipoCombustible, Integer cilindrada, String placa, String modelo, Usuario usuario, String marca) {
        this.id = id;
        this.kmActual = kmActual;
        this.color = color;
        this.tipoCombustible = tipoCombustible;
        this.cilindrada = cilindrada;
        this.placa = placa;
        this.modelo = modelo;
        this.usuario = usuario;
        this.marca = marca;
    }

    public Motocicleta(Usuario usuario, String marca, String modelo, String placa, Integer cilindrada, String tipoCombustible, String color, Double kmActual) {
        this.usuario = usuario;
        this.marca = marca;
        this.modelo = modelo;
        this.placa = placa;
        this.cilindrada = cilindrada;
        this.tipoCombustible = tipoCombustible;
        this.color = color;
        this.kmActual = kmActual;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getKmActual() {
        return kmActual;
    }

    public void setKmActual(Double kmActual) {
        this.kmActual = kmActual;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getTipoCombustible() {
        return tipoCombustible;
    }

    public void setTipoCombustible(String tipoCombustible) {
        this.tipoCombustible = tipoCombustible;
    }

    public Integer getCilindrada() {
        return cilindrada;
    }

    public void setCilindrada(Integer cilindrada) {
        this.cilindrada = cilindrada;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<DocumentoLegal> getDocumentos() { return documentos; }
    public void setDocumentos(List<DocumentoLegal> documentos) { this.documentos = documentos; }
}
