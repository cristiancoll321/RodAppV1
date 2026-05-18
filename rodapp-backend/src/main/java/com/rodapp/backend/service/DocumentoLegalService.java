package com.rodapp.backend.service;

import com.rodapp.backend.model.DocumentoLegal;
import com.rodapp.backend.model.Motocicleta;
import com.rodapp.backend.repository.DocumentoLegalRepository;
import com.rodapp.backend.repository.MotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

//Colocamos esta capa al servicio del controlador
//Un microservicio
@Service
public class DocumentoLegalService {

    //Inyección de dependencias
    @Autowired
    private DocumentoLegalRepository documentoRepository;

    @Autowired
    private MotoRepository motoRepository;

    //Creamos documento
    public DocumentoLegal guardar(Long motoId, DocumentoLegal doc){
        Motocicleta moto = motoRepository.findById(motoId)
                .orElseThrow(()-> new RuntimeException("Moto no encontrada"));
        doc.setMotocicleta(moto);
        return documentoRepository.save(doc);
    }

    //Ver todos los documentos de una Moto
    public List<DocumentoLegal> buscarPorMoto(Long motoId){
        return documentoRepository.findByMotocicletaId(motoId);
    }

    //Ver un documento específico
    public DocumentoLegal buscarPorId(Long id){
        return documentoRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Documento No encontrado"));
    }

    //Actualizar documento
    public DocumentoLegal actualizar (Long id, DocumentoLegal datosNuevos){
        DocumentoLegal doc = buscarPorId(id);
        doc.setTipo(datosNuevos.getTipo());
        doc.setNumeroPoliza(datosNuevos.getNumeroPoliza());
        doc.setFechaVencimiento(datosNuevos.getFechaVencimiento());
        return documentoRepository.save(doc);
    }

    // Eliminar documento
    public void eliminar(Long id) {
        documentoRepository.deleteById(id);
    }

    // Documentos próximos a vencer en 30 días (para alertas)
    public List<DocumentoLegal> proximosAVencer() {
        LocalDate hoy = LocalDate.now();
        LocalDate en30dias = hoy.plusDays(30);
        return documentoRepository.findByFechaVencimientoBetween(hoy, en30dias);
    }


}

