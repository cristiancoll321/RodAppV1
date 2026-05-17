package com.rodapp.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.rodapp.backend.model.enums.TipoDocumento;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table
public class DocumentoLegal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "moto_id")
    private Motocicleta motocicleta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDocumento tipo;

    private String numeroPoliza;

    @Column(nullable = false)
    private LocalDate fechaVencimiento;


    // Constructor vacío (obligatorio para JPA)
    public DocumentoLegal() {}


    public DocumentoLegal(Motocicleta motocicleta, TipoDocumento tipo, String numeroPoliza, LocalDate fechaVencimiento) {
        this.motocicleta = motocicleta;
        this.tipo = tipo;
        this.numeroPoliza = numeroPoliza;
        this.fechaVencimiento = fechaVencimiento;
    }


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

    public TipoDocumento getTipo() {
        return tipo;
    }

    public void setTipo(TipoDocumento tipo) {
        this.tipo = tipo;
    }

    public String getNumeroPoliza() {
        return numeroPoliza;
    }

    public void setNumeroPoliza(String numeroPoliza) {
        this.numeroPoliza = numeroPoliza;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
}
