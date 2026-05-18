package com.rodapp.backend.controller;

import com.rodapp.backend.model.DocumentoLegal;
import com.rodapp.backend.service.DocumentoLegalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motos/{motoId}/documentos")
public class DocumentoLegalController {

    @Autowired
    private DocumentoLegalService documentoService;

    //POST api/motos/1/documentos
    @PostMapping
    public ResponseEntity<DocumentoLegal> crear(
            @PathVariable Long motoId,
            @RequestBody DocumentoLegal doc){
        return ResponseEntity.status(201).body(documentoService.guardar(motoId, doc));
    }

    // GET /api/motos/1/documentos
    @GetMapping
    public ResponseEntity<List<DocumentoLegal>> listar(@PathVariable Long motoId) {
        return ResponseEntity.ok(documentoService.buscarPorMoto(motoId));
    }

    // GET /api/motos/1/documentos/2
    @GetMapping("/{id}")
    public ResponseEntity<DocumentoLegal> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(documentoService.buscarPorId(id));
    }

    // PUT /api/motos/1/documentos/2
    @PutMapping("/{id}")
    public ResponseEntity<DocumentoLegal> actualizar(
            @PathVariable Long id,
            @RequestBody DocumentoLegal doc) {
        return ResponseEntity.ok(documentoService.actualizar(id, doc));
    }

    // DELETE /api/motos/1/documentos/2
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        documentoService.eliminar(id);
        return ResponseEntity.ok("Documento eliminado");
    }


}
