const Renderer = {
    canvas: null,
    ctx: null,
    
    carX: 100,
    carY: 250,
    
    cloudX: 0,
    treeOffset: 0,
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    },
    
    render() {
        this.clearCanvas();
        this.drawSky();
        this.drawGround();
        this.drawClouds();
        this.drawTrees();
        this.drawRoadSigns();
        this.drawBuildings();
        this.drawHighway();
        this.drawCar();
        this.drawDistance();
        this.drawMoraleLegend();
        this.drawMoraleIndicator();
        this.drawGasGauge();
        
        this.treeOffset = (this.treeOffset + 2) % 100;
        this.cloudX = (this.cloudX + 0.5) % this.canvas.width;
    },
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    drawSky() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.6);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#b0d8f0');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.6);
    },
    
    drawGround() {
        this.ctx.fillStyle = '#90c090';
        this.ctx.fillRect(0, this.canvas.height * 0.6, this.canvas.width, this.canvas.height * 0.4);
        
        this.ctx.fillStyle = '#7ab07a';
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * this.canvas.width;
            const y = this.canvas.height * 0.6 + Math.random() * this.canvas.height * 0.4;
            this.ctx.fillRect(x, y, 4, 3);
        }
    },
    
    drawClouds() {
        this.ctx.fillStyle = '#ffffff';
        
        this.drawCloud(this.cloudX, 50);
        this.drawCloud(this.cloudX + 300, 80);
        this.drawCloud(this.cloudX + 600, 40);
    },
    
    drawCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        this.ctx.fill();
    },
    
    drawTrees() {
        for (let i = 0; i < 5; i++) {
            const x = (i * 200 - this.treeOffset) % this.canvas.width;
            const y = this.canvas.height * 0.5;
            this.drawTree(x, y);
        }
    },
    
    drawTree(x, y) {
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x, y, 15, 40);
        
        this.ctx.fillStyle = '#228b22';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 7.5, y - 20);
        this.ctx.lineTo(x - 10, y + 10);
        this.ctx.lineTo(x + 25, y + 10);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + 7.5, y - 10);
        this.ctx.lineTo(x - 5, y + 15);
        this.ctx.lineTo(x + 20, y + 15);
        this.ctx.closePath();
        this.ctx.fill();
    },
    
    drawHighway() {
        this.ctx.fillStyle = '#404040';
        this.ctx.fillRect(0, this.canvas.height * 0.65, this.canvas.width, 80);
        
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([20, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height * 0.705);
        this.ctx.lineTo(this.canvas.width, this.canvas.height * 0.705);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height * 0.66);
        this.ctx.lineTo(this.canvas.width, this.canvas.height * 0.66);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height * 0.75);
        this.ctx.lineTo(this.canvas.width, this.canvas.height * 0.75);
        this.ctx.stroke();
    },
    
    drawCar() {
        const x = this.carX;
        const y = this.carY;
        
        this.ctx.fillStyle = '#c41e3a';
        this.ctx.fillRect(x + 10, y + 20, 80, 30);
        
        this.ctx.fillStyle = '#8b1a2e';
        this.ctx.fillRect(x + 20, y + 5, 60, 20);
        
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.fillRect(x + 25, y + 8, 20, 12);
        this.ctx.fillRect(x + 55, y + 8, 20, 12);
        
        this.drawFamilyInCar(x, y);
        
        this.ctx.fillStyle = '#2c2c2c';
        this.ctx.beginPath();
        this.ctx.arc(x + 25, y + 50, 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x + 75, y + 50, 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.beginPath();
        this.ctx.arc(x + 25, y + 50, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x + 75, y + 50, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(x + 8, y + 25, 4, 6);
        this.ctx.fillRect(x + 88, y + 25, 4, 6);
        
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + 10, y + 20, 80, 30);
        this.ctx.strokeRect(x + 20, y + 5, 60, 20);
    },
    
    drawFamilyInCar(x, y) {
        const morale = GameState.morale;
        const faceColor = morale > 70 ? '#ffcc99' : morale > 40 ? '#ffb380' : '#ff9966';
        
        this.ctx.fillStyle = faceColor;
        this.ctx.fillRect(x + 27, y + 10, 8, 8);
        this.ctx.fillRect(x + 38, y + 10, 8, 8);
        
        this.ctx.fillRect(x + 57, y + 10, 8, 8);
        this.ctx.fillRect(x + 68, y + 10, 8, 8);
        
        this.ctx.fillStyle = '#000000';
        if (morale > 60) {
            this.ctx.fillRect(x + 29, y + 12, 2, 2);
            this.ctx.fillRect(x + 32, y + 12, 2, 2);
            this.ctx.fillRect(x + 40, y + 12, 2, 2);
            this.ctx.fillRect(x + 43, y + 12, 2, 2);
            this.ctx.fillRect(x + 59, y + 12, 2, 2);
            this.ctx.fillRect(x + 62, y + 12, 2, 2);
            this.ctx.fillRect(x + 70, y + 12, 2, 2);
            this.ctx.fillRect(x + 73, y + 12, 2, 2);
            
            this.ctx.fillRect(x + 29, y + 16, 1, 1);
            this.ctx.fillRect(x + 30, y + 15, 2, 1);
            this.ctx.fillRect(x + 32, y + 16, 1, 1);
            this.ctx.fillRect(x + 40, y + 16, 1, 1);
            this.ctx.fillRect(x + 41, y + 15, 2, 1);
            this.ctx.fillRect(x + 43, y + 16, 1, 1);
            this.ctx.fillRect(x + 59, y + 16, 1, 1);
            this.ctx.fillRect(x + 60, y + 15, 2, 1);
            this.ctx.fillRect(x + 62, y + 16, 1, 1);
            this.ctx.fillRect(x + 70, y + 16, 1, 1);
            this.ctx.fillRect(x + 71, y + 15, 2, 1);
            this.ctx.fillRect(x + 73, y + 16, 1, 1);
        } else if (morale > 30) {
            this.ctx.fillRect(x + 29, y + 12, 2, 2);
            this.ctx.fillRect(x + 32, y + 12, 2, 2);
            this.ctx.fillRect(x + 40, y + 12, 2, 2);
            this.ctx.fillRect(x + 43, y + 12, 2, 2);
            this.ctx.fillRect(x + 59, y + 12, 2, 2);
            this.ctx.fillRect(x + 62, y + 12, 2, 2);
            this.ctx.fillRect(x + 70, y + 12, 2, 2);
            this.ctx.fillRect(x + 73, y + 12, 2, 2);
            
            this.ctx.fillRect(x + 29, y + 15, 5, 1);
            this.ctx.fillRect(x + 40, y + 15, 5, 1);
            this.ctx.fillRect(x + 59, y + 15, 5, 1);
            this.ctx.fillRect(x + 70, y + 15, 5, 1);
        } else {
            this.ctx.fillRect(x + 29, y + 13, 2, 1);
            this.ctx.fillRect(x + 32, y + 13, 2, 1);
            this.ctx.fillRect(x + 40, y + 13, 2, 1);
            this.ctx.fillRect(x + 43, y + 13, 2, 1);
            this.ctx.fillRect(x + 59, y + 13, 2, 1);
            this.ctx.fillRect(x + 62, y + 13, 2, 1);
            this.ctx.fillRect(x + 70, y + 13, 2, 1);
            this.ctx.fillRect(x + 73, y + 13, 2, 1);
            
            this.ctx.fillRect(x + 29, y + 16, 1, 1);
            this.ctx.fillRect(x + 30, y + 17, 2, 1);
            this.ctx.fillRect(x + 32, y + 16, 1, 1);
            this.ctx.fillRect(x + 40, y + 16, 1, 1);
            this.ctx.fillRect(x + 41, y + 17, 2, 1);
            this.ctx.fillRect(x + 43, y + 16, 1, 1);
            this.ctx.fillRect(x + 59, y + 16, 1, 1);
            this.ctx.fillRect(x + 60, y + 17, 2, 1);
            this.ctx.fillRect(x + 62, y + 16, 1, 1);
            this.ctx.fillRect(x + 70, y + 16, 1, 1);
            this.ctx.fillRect(x + 71, y + 17, 2, 1);
            this.ctx.fillRect(x + 73, y + 16, 1, 1);
        }
        
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(x + 28, y + 8, 6, 2);
        this.ctx.fillRect(x + 39, y + 8, 6, 2);
        this.ctx.fillRect(x + 58, y + 8, 6, 2);
        this.ctx.fillRect(x + 69, y + 8, 6, 2);
    },
    
    drawDistance() {
        this.ctx.fillStyle = '#2c1810';
        this.ctx.font = 'bold 16px "Courier New"';
        this.ctx.fillText(`${GameState.distance} miles`, 10, 30);
        
        const nextLocation = Locations.getNextLocation();
        if (nextLocation) {
            const distanceToNext = Locations.getDistanceToNext();
            this.ctx.fillText(`Next: ${nextLocation.name} (${distanceToNext} mi)`, 10, 50);
        }
    },
    
    drawMoraleLegend() {
        const startX = 220;
        const y = 15;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(startX - 5, y - 5, 420, 35);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px "Courier New"';
        this.ctx.fillText('Family Morale:', startX, y + 12);
        
        GameState.party.forEach((member, index) => {
            if (member.alive) {
                const x = startX + 110 + (index * 95);
                const morale = member.morale;
                
                let color = '#44ff44';
                let status = 'Happy';
                
                if (morale < 20) {
                    color = '#ff0000';
                    status = 'Miserable';
                } else if (morale < 40) {
                    color = '#ff4444';
                    status = 'Grumpy';
                } else if (morale < 60) {
                    color = '#ffaa44';
                    status = 'Neutral';
                } else if (morale < 80) {
                    color = '#88ff88';
                    status = 'Content';
                }
                
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x - 15, y + 3, 12, 12);
                
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x - 15, y + 3, 12, 12);
                
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 10px "Courier New"';
                this.ctx.fillText(member.name + ':', x, y + 12);
                
                this.ctx.fillStyle = color;
                this.ctx.font = 'bold 9px "Courier New"';
                this.ctx.fillText(morale.toString(), x, y + 24);
            }
        });
    },
    
    drawMoraleIndicator() {
        const startX = this.canvas.width - 200;
        const y = 150;
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px "Courier New"';
        this.ctx.fillText('Family Morale', startX + 20, y - 10);
        
        GameState.party.forEach((member, index) => {
            if (member.alive) {
                const x = startX + (index * 45);
                this.drawPersonThermometer(x, y, member.name, member.morale);
            }
        });
    },
    
    drawPersonThermometer(x, y, name, morale) {
        let fillColor = '#44ff44';
        
        if (morale < 20) {
            fillColor = '#ff0000';
        } else if (morale < 40) {
            fillColor = '#ff4444';
        } else if (morale < 60) {
            fillColor = '#ffaa44';
        } else if (morale < 80) {
            fillColor = '#88ff88';
        }
        
        this.ctx.fillStyle = '#cccccc';
        this.ctx.fillRect(x + 5, y, 6, 3);
        this.ctx.fillRect(x + 3, y + 3, 10, 3);
        this.ctx.fillRect(x + 1, y + 6, 14, 3);
        this.ctx.fillRect(x, y + 9, 16, 80);
        this.ctx.fillRect(x + 1, y + 89, 14, 6);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x + 2, y + 11, 12, 76);
        
        const fillHeight = Math.floor((morale / 100) * 72);
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(x + 3, y + 85 - fillHeight, 10, fillHeight);
        
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x + 6, y + 91, 4, 2);
        
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y + 9, 16, 80);
        this.ctx.strokeRect(x + 1, y + 89, 14, 6);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 8px "Courier New"';
        const nameShort = name.substring(0, 4);
        this.ctx.fillText(nameShort, x - 2, y + 102);
        
        this.ctx.fillText(morale.toString(), x + 2, y + 112);
    },
    
    drawGasGauge() {
        const x = this.canvas.width - 160;
        const y = 30;
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px "Courier New"';
        this.ctx.fillText('Gas', x + 5, y - 5);
        
        const gas = GameState.gas;
        const maxGas = 100;
        let fillColor = '#44ff44';
        
        if (gas < 20) {
            fillColor = '#ff0000';
        } else if (gas < 40) {
            fillColor = '#ff8800';
        } else if (gas < 60) {
            fillColor = '#ffaa44';
        }
        
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(x, y, 50, 80);
        
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(x + 2, y + 2, 46, 76);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x + 4, y + 4, 42, 72);
        
        const fillHeight = Math.floor((gas / maxGas) * 68);
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(x + 6, y + 74 - fillHeight, 38, fillHeight);
        
        this.ctx.fillStyle = '#000000';
        for (let i = 0; i < 5; i++) {
            const tickY = y + 8 + (i * 16);
            this.ctx.fillRect(x + 4, tickY, 4, 1);
            this.ctx.fillRect(x + 42, tickY, 4, 1);
        }
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 8px "Courier New"';
        this.ctx.fillText('F', x + 52, y + 12);
        this.ctx.fillText('E', x + 52, y + 76);
        
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, 50, 80);
    },
    
    drawRoadSigns() {
        const signX = (this.treeOffset * 3) % this.canvas.width;
        
        if (signX > 50 && signX < this.canvas.width - 50) {
            const x = signX;
            const y = this.canvas.height * 0.55;
            
            this.ctx.fillStyle = '#654321';
            this.ctx.fillRect(x, y, 4, 30);
            
            this.ctx.fillStyle = '#228b22';
            this.ctx.fillRect(x - 15, y - 5, 34, 20);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 10px "Courier New"';
            const nextLoc = Locations.getNextLocation();
            if (nextLoc) {
                const text = nextLoc.name.substring(0, 8);
                this.ctx.fillText(text, x - 12, y + 7);
            }
        }
    },
    
    drawBuildings() {
        const currentLoc = Locations.getCurrentLocation();
        
        if (currentLoc && currentLoc.hasStore && GameState.distance % 100 < 50) {
            const x = this.canvas.width - 150;
            const y = this.canvas.height * 0.45;
            
            if (currentLoc.type === 'gas_station') {
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.fillRect(x, y, 40, 50);
                
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(x + 5, y + 5, 10, 10);
                this.ctx.fillRect(x + 25, y + 5, 10, 10);
                
                this.ctx.fillStyle = '#ffff00';
                this.ctx.fillRect(x + 10, y + 25, 20, 15);
                
                this.ctx.fillStyle = '#000000';
                this.ctx.font = 'bold 8px "Courier New"';
                this.ctx.fillText('GAS', x + 12, y + 35);
            } else if (currentLoc.type === 'city') {
                for (let i = 0; i < 3; i++) {
                    this.ctx.fillStyle = i % 2 === 0 ? '#808080' : '#a0a0a0';
                    this.ctx.fillRect(x + i * 15, y + 10, 12, 40);
                    
                    this.ctx.fillStyle = '#ffff99';
                    for (let j = 0; j < 4; j++) {
                        this.ctx.fillRect(x + i * 15 + 2, y + 15 + j * 8, 3, 3);
                        this.ctx.fillRect(x + i * 15 + 7, y + 15 + j * 8, 3, 3);
                    }
                }
            }
        }
    }
};
