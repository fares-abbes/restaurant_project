package com.internship.reservation_service.exception;

public class TableAlreadyReservedException extends RuntimeException {
    public TableAlreadyReservedException(String message) {
        super(message);
    }
}
