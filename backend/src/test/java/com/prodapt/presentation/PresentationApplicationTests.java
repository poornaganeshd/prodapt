package com.prodapt.presentation;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class PresentationApplicationTests {

    @Test
    void applicationClassLoads() {
        assertNotNull(PresentationApplication.class);
    }
}
