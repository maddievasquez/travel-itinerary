// Filename - components/footer.js

import React from "react";
import {
    Box,
    FooterContainer,
    Row,
    Column,
    FooterLink,
    Heading,
} from "./footerStyles";

const Footer = () => {
    return (
        <Box>
            <h1
                style={{
                    color: "green",
                    textAlign: "center",
                    marginTop: "10px",
                }}
            >
                A Travel itinerary app for all!
            </h1>
            <FooterContainer>
                <Row>
                    <Column>
                        <Heading>About Us</Heading>
                        
                        <FooterLink href="#">
                            Vision
                        </FooterLink>

                    </Column>
                    
                    <Column>
                        <Heading>Contact Us</Heading>
                        <FooterLink href="#">
                            Infos
                        </FooterLink>
                        
                    </Column>
                    <Column>
                        <Heading>Social Media</Heading>
                        <FooterLink href="#">
                            <i className="fab fa-facebook-f">
                                <span
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    Facebook
                                </span>
                            </i>
                        </FooterLink>
                        <FooterLink href="#">
                            <i className="fab fa-instagram">
                                <span
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    Instagram
                                </span>
                            </i>
                        </FooterLink>
                    </Column>
                </Row>
            </FooterContainer>
        </Box>
    );
};
export default Footer;