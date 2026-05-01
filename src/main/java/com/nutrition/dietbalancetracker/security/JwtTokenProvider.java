package com.nutrition.dietbalancetracker.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * JWT TOKEN PROVIDER
 * ==================
 * Creates and validates JWT tokens for authentication.
 */
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    // Generate a JWT token for a user (includes role claim)
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(key)
                .compact();
    }
    
    // Get username from token
    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    // Get role from token
    public String getRoleFromToken(String token) {
        String role = getClaims(token).get("role", String.class);
        return role != null ? role : "USER";
    }
    
    // Validate token
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.parser()
            .verifyWith(key)
                .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
