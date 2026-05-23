package com.rodapp.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table
public class @@Motocicleta {
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




    /**
     * Constructor vacío (sin argumentos).
     * Requerido por JPA (Java Persistence API) para poder instanciar el objeto
     * cuando recupera datos desde la base de datos antes de poblar sus campos.
     */
    public Motocicleta() {
    }

    /**
     * Constructor completo con ID.
     * Se utiliza principalmente cuando ya tenemos una entidad existente (por ejemplo, al actualizar)
     * y queremos mapear todos sus campos, incluido su identificador único.
     * 
     * @param id Identificador único en la base de datos.
     * @param kmActual Kilometraje actual de la moto.
     * @param color Color del vehículo.
     * @param tipoCombustible Gasolina, Eléctrica, etc.
     * @param cilindrada Capacidad del motor en CC.
     * @param placa Matrícula única.
     * @param modelo Nombre o referencia del modelo.
     * @param usuario Objeto Usuario al que pertenece la moto (Relación ManyToOne).
     * @param marca Fabricante de la moto.
     */
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

    /**
     * Constructor sin ID.
     * Ideal para el proceso de creación (POST). El ID no se envía porque la base de datos
     * lo genera automáticamente (GenerationType.IDENTITY).
     * 
     * @param usuario Dueño de la moto.
     * @param marca Marca del fabricante.
     * @param modelo Referencia del modelo.
     * @param placa Matrícula.
     * @param cilindrada Cilindraje.
     * @param tipoCombustible Tipo de energía.
     * @param color Color estético.
     * @param kmActual Recorrido inicial.
     */
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
