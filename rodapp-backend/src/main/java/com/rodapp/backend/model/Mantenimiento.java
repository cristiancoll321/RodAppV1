package com.rodapp.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "mantenimientos")
public class Mantenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "moto_id", nullable = false)
    private Motocicleta motocicleta;

    @Column(nullable = false, length = 100)
    private String tipoServicio;

    @Column(nullable = false)
    private Double costo;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    // Constructor vacío (obligatorio para JPA)
    public Mantenimiento() {}

    // Constructor con parámetros (útil para crear rápidamente)
    public Mantenimiento(Motocicleta motocicleta, String tipoServicio,
                         Double costo, String descripcion, LocalDate fecha) {
        this.motocicleta = motocicleta;
        this.tipoServicio = tipoServicio;
        this.costo = costo;
        this.descripcion = descripcion;
        this.fecha = fecha;
    }

    // Constructor sin descripción (para casos simples)
    public Mantenimiento(Motocicleta motocicleta, String tipoServicio, Double costo, LocalDate fecha) {
        this(motocicleta, tipoServicio, costo, null, fecha);
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

    public String getTipoServicio() {
        return tipoServicio;
    }

    public void setTipoServicio(String tipoServicio) {
        this.tipoServicio = tipoServicio;
    }

    public Double getCosto() {
        return costo;
    }

    public void setCosto(Double costo) {
        this.costo = costo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    // Metodo útil para formatear costo
    public String getCostoFormateado() {
        return String.format("$%,.0f", costo);
    }

    // Metodo útil para saber si es mantenimiento reciente (últimos 30 días)
    public boolean esReciente() {
        return fecha.isAfter(LocalDate.now().minusDays(30));
    }

    @Override
    public String toString() {
        return "Mantenimiento{" +
                "id=" + id +
                ", tipoServicio='" + tipoServicio + '\'' +
                ", costo=" + costo +
                ", fecha=" + fecha +
                '}';
    }
}