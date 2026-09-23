package mk.ukim.finki.backend.web.handler;

import mk.ukim.finki.backend.model.exceptions.ModelProviderException;
import mk.ukim.finki.backend.web.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ExceptionHandler(ModelProviderException.class)
public ResponseEntity<ErrorResponse> ModelProviderExceptionHandler(ModelProviderException ex) {
    return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(new ErrorResponse(ex.getMessage()));
}