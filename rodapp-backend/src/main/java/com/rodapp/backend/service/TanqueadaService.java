package com.rodapp.backend.service;

import com.rodapp.backend.model.Tanqueada;
import com.rodapp.backend.repository.TanqueadaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TanqueadaService {

    @Autowired
    private TanqueadaRepository tanqueadaRepository;

    /**
      * Descripción: Obtiene el historial de todas las
     tanqueadas registradas.
      * Viaje del dato: El repositorio ejecuta un "SELECT *
     FROM tanqueadas" mediante JPA.
      * @return Lista de todas las tanqueadas.
      */
    public List<Tanqueada> listarTodas() {
        return tanqueadaRepository.findAll();
    }

    /**
      * Descripción: Obtiene las tanqueadas asociadas a una
     moto específica.
      * Viaje del dato: Filtra en la base de datos por la
     llave foránea 'moto_id'.
      * @param motoId Identificador de la motocicleta.
      * @return Lista de tanqueadas de esa moto.
      */
    public List<Tanqueada> listarPorMoto(Long motoId) {
        return tanqueadaRepository.findByMotocicletaId(motoId);
    }

    /**
      * Descripción: Registra un nuevo consumo de
     combustible.
      * Viaje del dato: Recibe el objeto del controlador y
     genera un INSERT en la tabla 'tanqueadas'.
      * @param tanqueada Objeto con los datos de galones,
     valor y odómetro.
      * @return La tanqueada guardada con su ID generado.
      */
    public Tanqueada registrar(Tanqueada tanqueada) {
        return tanqueadaRepository.save(tanqueada);
    }

    /**
      * Descripción: Busca una tanqueada por su ID único.
      * Viaje del dato: Ejecuta un SELECT filtrando por la
     llave primaria ID.
      * @param id Identificador único.
      * @return La tanqueada encontrada.
      * @throws RuntimeException Si el ID no existe.
      */
    public Tanqueada obtenerPorId(Long id) {
        return tanqueadaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de tanqueada no encontrado con el id: " + id));
    }

    /**
      * Descripción: Actualiza un registro de tanqueada
     existente.
      * Viaje del dato:
      * 1. Verifica existencia.
      * 2. Mapea los nuevos valores sobre el objeto
     persistente.
      * 3. Guarda los cambios (UPDATE).
      * @param id ID del registro a modificar.
      * @param detalles Nuevos datos.
      * @return Registro actualizado.
      */
    public Tanqueada actualizar(Long id, Tanqueada detalles) {
        Tanqueada tanqueada = obtenerPorId(id);
        tanqueada.setFecha(detalles.getFecha());
        tanqueada.setGalones(detalles.getGalones());

        tanqueada.setValorPagado(detalles.getValorPagado());
        tanqueada.setOdometro(detalles.getOdometro());

        tanqueada.setTipoCombustible(detalles.getTipoCombustible());
        return tanqueadaRepository.save(tanqueada);
    }

    /**
      * Descripción: Elimina un registro del historial.
      * Viaje del dato: Ejecuta un DELETE en la base de
     datos tras verificar su existencia.
      * @param id ID a eliminar.
      */
    public void eliminar(Long id) {
        Tanqueada tanqueada = obtenerPorId(id);
        tanqueadaRepository.delete(tanqueada);
    }
}
