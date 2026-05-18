package com.rodapp.backend.repository;

import com.rodapp.backend.model.DocumentoLegal;
import com.rodapp.backend.model.enums.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DocumentoLegalRepository extends JpaRepository<DocumentoLegal, Long> {

    //Todos los dumentos de una moto
    List<DocumentoLegal> findByMotocicletaId(Long motoId);

    // Documentos por tipo (ej: todos los SOAT)
    List<DocumentoLegal> findByMotocicletaIdAndTipo(Long motoId, TipoDocumento tipo);

    // Documentos que vencen antes de una fecha (para alertas)
    List<DocumentoLegal> findByFechaVencimientoBefore(LocalDate fecha);

    // Documentos próximos a vencer en X días
    List<DocumentoLegal> findByFechaVencimientoBetween(LocalDate inicio, LocalDate fin);
}
