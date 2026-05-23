package com.rodapp.backend.service;

import com.rodapp.backend.model.Mantenimiento;
import com.rodapp.backend.repository.MantenimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MantenimientoService {

    @Autowired
    private MantenimientoRepository mantenimientoRepository;

    /**
      * Obtiene la lista completa de mantenimientos registrados.
      * Viaje del dato: Llama al repositorio (JPA) que ejecuta un "SELECT * FROM mantenimientos".
      * @return List de objetos Mantenimiento.
      */
    public List<Mantenimiento> getMantenimientos() {
        return mantenimientoRepository.findAll();
    }

    /**
      * Guarda un nuevo registro de mantenimiento.
      * Viaje del dato: Recibe el objeto desde el controlador, JPA genera el INSERT y
      * retorna la entidad con su ID asignado por la base de datos.
      * @param mantenimiento Objeto con los datos a persistir.
      * @return Mantenimiento guardado.
      */
    public Mantenimiento registrar(Mantenimiento mantenimiento){
        return mantenimientoRepository.save(mantenimiento);
    }

    /**
      * Busca un mantenimiento por su identificador único.
      * Viaje del dato: Accede a la DB por ID; lanza excepción si no existe.
      * @param id ID del mantenimiento.
      * @return El objeto Mantenimiento encontrado.
      */
    public Mantenimiento getMantenimientoPorId(Long id) {
        return mantenimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mantenimiento no encontrado con el id: " + id));
    }

    /**
      * Actualiza los datos de un mantenimiento existente.
      * Viaje del dato:
      * 1. Verifica existencia del registro original.
      * 2. Mapea los campos modificados.
      * 3. Persiste los cambios mediante un UPDATE de JPA.
      */
    public Mantenimiento actualizar(Long id, Mantenimiento detalles) {
        Mantenimiento mantenimiento = getMantenimientoPorId(id);
        mantenimiento.setTipoServicio(detalles.getTipoServicio());
        mantenimiento.setCosto(detalles.getCosto());
        mantenimiento.setDescripcion(detalles.getDescripcion());
        mantenimiento.setFecha(detalles.getFecha());
        return mantenimientoRepository.save(mantenimiento);
    }

    /**
      * Elimina un registro de mantenimiento.
      * Viaje del dato: Verifica existencia y ejecuta el DELETE SQL correspondiente.
      * @param id ID del registro a borrar.
      */
    public void eliminar(Long id) {
        Mantenimiento mantenimiento = getMantenimientoPorId(id);
        mantenimientoRepository.delete(mantenimiento);
    }
}
