package com.rodapp.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.rodapp.backend.model.enums.TipoCombustible;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tanqueadas")
public class Tanqueada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "moto_id", nullable = false)
    private Motocicleta motocicleta;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private Double galones;

    @Column(nullable = false)
    private Double valorPagado;

    @Column(nullable = false)
    private Integer odometro;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCombustible tipoCombustible;

    // Constructor vacío (obligatorio)
    public Tanqueada() {}

    // Constructor con parámetros
    public Tanqueada(Motocicleta motocicleta, LocalDateTime fecha, Double galones, Double valorPagado, Integer odometro, TipoCombustible tipoCombustible) {
        this.motocicleta = motocicleta;
        this.fecha = fecha;
        this.galones = galones;
        this.valorPagado = valorPagado;
        this.odometro = odometro;
        this.tipoCombustible = tipoCombustible;
    }

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Motocicleta getMotocicleta() {
        return motocicleta;
    }

    public void setMotocicleta(Motocicleta motocicleta) {
        this.motocicleta = motocicleta;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Double getGalones() {
        return galones;
    }

    public void setGalones(Double galones) {
        this.galones = galones;
    }

    public Double getValorPagado() {
        return valorPagado;
    }

    public void setValorPagado(Double valorPagado) {
        this.valorPagado = valorPagado;
    }

    public Integer getOdometro() {
        return odometro;
    }

    public void setOdometro(Integer odometro) {
        this.odometro = odometro;
    }

    public TipoCombustible getTipoCombustible() {
        return tipoCombustible;
    }

    public void setTipoCombustible(TipoCombustible tipoCombustible) {
        this.tipoCombustible = tipoCombustible;
    }
}
