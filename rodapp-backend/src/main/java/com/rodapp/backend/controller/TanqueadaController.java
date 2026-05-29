package com.rodapp.backend.controller;

import com.rodapp.backend.model.Tanqueada;
import com.rodapp.backend.service.TanqueadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tanqueadas")
public class TanqueadaController {

    @Autowired
    private TanqueadaService tanqueadaService;

    /**
      * ENDPOINT: GET /api/tanqueadas
      * Propósito: Obtener todo el historial de consumo de
     combustible.
      * Viaje del dato: El servicio retorna la lista y
     Spring la serializa a JSON.
      * @return Lista total de tanqueadas.
      */
    @GetMapping
    public List<Tanqueada> listar() {
        return tanqueadaService.listarTodas();
    }

    /**
      * ENDPOINT: GET /api/tanqueadas/moto/{motoId}
      * Propósito: Filtrar tanqueadas para una moto
     específica en el módulo de historial.
      * Viaje del dato: El ID de la moto se toma de la URL
     y se pasa al servicio.
      * @param motoId ID de la moto.
      * @return Lista filtrada.
      */
    @GetMapping("/moto/{motoId}")
    public List<Tanqueada> listarPorMoto(@PathVariable Long motoId) {
        return tanqueadaService.listarPorMoto(motoId);
    }

    /**
     * ENDPOINT: GET /api/tanqueadas/usuario/{usuarioId}
     * Propósito: Obtener el historial de combustible de todas las motos de un usuario.
     * @param usuarioId ID del usuario.
     * @return Lista de tanqueadas.
     */
    @GetMapping("/usuario/{usuarioId}")
    public List<Tanqueada> listarPorUsuario(@PathVariable Long usuarioId) {
        return tanqueadaService.listarPorUsuario(usuarioId);
    }

    /**
      * ENDPOINT: POST /api/tanqueadas
      * Propósito: Registrar un nuevo llenado de tanque
     desde el formulario 'fuel-register.html'.
      * Viaje del dato: Jackson convierte el JSON del
     cuerpo en un objeto Tanqueada.
      * @param tanqueada Datos del registro.
      * @return El registro creado (201 Created).
      */
    @PostMapping
    public ResponseEntity<Tanqueada> crear(@RequestBody Tanqueada tanqueada) {
        return ResponseEntity.status(201).body(tanqueadaService.registrar(tanqueada));
    }

    /**
      * ENDPOINT: GET /api/tanqueadas/{id}
      * Propósito: Consultar un registro específico para
     edición.
      * @param id ID del registro.
      * @return Datos de la tanqueada.
      */
    @GetMapping("/{id}")
    public ResponseEntity<Tanqueada> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(tanqueadaService.obtenerPorId(id));
    }

    /**
      * ENDPOINT: PUT /api/tanqueadas/{id}
      * Propósito: Corregir datos de un registro de
     combustible.
      * @param id ID a actualizar.
      * @param detalles Nuevos datos.
      * @return Objeto actualizado.
      */
    @PutMapping("/{id}")
    public ResponseEntity<Tanqueada>
    actualizar(@PathVariable Long id, @RequestBody Tanqueada detalles) {
        return ResponseEntity.ok(tanqueadaService.actualizar(id, detalles));
    }

    /**
      * ENDPOINT: DELETE /api/tanqueadas/{id}
      * Propósito: Eliminar un registro erróneo del
     historial.
      * @param id ID a eliminar.
      * @return Estado 204 (No Content).
      */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tanqueadaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

