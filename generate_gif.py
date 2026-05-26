import os
import math
import imageio
from PIL import Image, ImageDraw, ImageFont

# ==========================================
# 1. Configuration & Canvas Setup
# ==========================================
WIDTH, HEIGHT = 1600, 600       # Formatted compact height
BG_COLOR = (8, 9, 13)         # Deep slate dark `#08090d`
GRID_COLOR = (22, 26, 37)      # Grid dot color
CARD_BG = (15, 17, 24, 220)    # Semi-transparent card body
BORDER_COLOR = (255, 255, 255, 20)

ACCENT_ROSE = (239, 68, 68)    # `#ef4444`
ACCENT_AMBER = (245, 158, 11)   # `#f59e0b`
ACCENT_INDIGO = (99, 102, 241)  # `#6366f1`
ACCENT_PINK = (236, 72, 153)    # `#ec4899`
ACCENT_CYAN = (6, 182, 212)     # `#06b6d4`

# Load TrueType Bold Fonts for beautiful readability
try:
    FONT_BADGE = ImageFont.truetype("Arial Bold", 13)
    FONT_TITLE = ImageFont.truetype("Arial Bold", 21)
    FONT_DESC = ImageFont.truetype("Arial Bold", 15)
    FONT_HEADER = ImageFont.truetype("Arial Bold", 18)
    FONT_FOOTER = ImageFont.truetype("Arial Bold", 20)
except IOError:
    FONT_BADGE = ImageFont.load_default()
    FONT_TITLE = ImageFont.load_default()
    FONT_DESC = ImageFont.load_default()
    FONT_HEADER = ImageFont.load_default()
    FONT_FOOTER = ImageFont.load_default()

# Node Definitions for Tab 3 (All visible immediately in Final State)
nodes = [
    # Col 1: Attacker
    {"id": "ATK", "badge": "THREAT ACTOR", "title": "Attacker", "desc": "External adversary scanning hosts.", "color": ACCENT_ROSE, "x": 30, "y": 225, "width": 260, "height": 110},
    
    # Col 2: Vectors
    {"id": "V1", "badge": "VECTOR 1", "title": "RCE Exploit", "desc": "Arbitrary command execution.", "color": ACCENT_AMBER, "x": 330, "y": 30, "width": 260, "height": 110},
    {"id": "V2", "badge": "VECTOR 2", "title": "Supply Chain", "desc": "Injecting malicious base layers.", "color": ACCENT_AMBER, "x": 330, "y": 225, "width": 260, "height": 110},
    {"id": "V3", "badge": "VECTOR 3", "title": "Credential Theft", "desc": "Harvesting administrative keys.", "color": ACCENT_AMBER, "x": 330, "y": 420, "width": 260, "height": 110},
    
    # Col 3: Perimeter
    {"id": "WAF", "badge": "PERIMETER", "title": "WAF Bypass", "desc": "Evading web application guards.", "color": ACCENT_INDIGO, "x": 630, "y": 30, "width": 260, "height": 110},
    {"id": "REG", "badge": "REGISTRY", "title": "Malicious Registry", "desc": "Registry pulling backdoors.", "color": ACCENT_INDIGO, "x": 630, "y": 225, "width": 260, "height": 110},
    {"id": "API", "badge": "CONTROL PLANE", "title": "K8s API Access", "desc": "Stolen certificate execution.", "color": ACCENT_INDIGO, "x": 630, "y": 420, "width": 260, "height": 110},
    
    # Col 4: Kubernetes Subgraph Box
    {"id": "K8s", "badge": "SUBGRAPH", "title": "K8s Cluster", "desc": "", "color": ACCENT_CYAN, "x": 930, "y": 30, "width": 300, "height": 505, "isGroup": True},
    
    # Inside Cluster: Child workloads (coordinates are absolute for rendering convenience)
    {"id": "POD", "badge": "WORKLOAD", "title": "Targeted Pod", "desc": "Sandboxed compromised workload shell.", "color": ACCENT_PINK, "x": 950, "y": 110, "width": 260, "height": 110},
    {"id": "NODE", "badge": "LATERAL ESCAPE", "title": "Host Node Escape", "desc": "Privilege escalation breakout.", "color": ACCENT_ROSE, "x": 950, "y": 350, "width": 260, "height": 110},
    
    # Col 5: Post Exploitation
    {"id": "POST", "badge": "C2 POST-EXPLOIT", "title": "C2 Webshell Tunnel", "desc": "Reverse shell crypto mining.", "color": ACCENT_ROSE, "x": 1290, "y": 120, "width": 260, "height": 110},
]

# Edge Definitions (All visible in Final State)
edges = [
    {"source": "ATK", "target": "V1", "color": ACCENT_ROSE},
    {"source": "ATK", "target": "V2", "color": ACCENT_ROSE},
    {"source": "ATK", "target": "V3", "color": ACCENT_ROSE},
    
    {"source": "V1", "target": "WAF", "color": ACCENT_AMBER},
    {"source": "V2", "target": "REG", "color": ACCENT_AMBER},
    {"source": "V3", "target": "API", "color": ACCENT_AMBER},
    
    {"source": "WAF", "target": "POD", "color": ACCENT_INDIGO, "label": "exploit"},
    {"source": "REG", "target": "POD", "color": ACCENT_INDIGO, "label": "pull"},
    {"source": "API", "target": "POD", "color": ACCENT_INDIGO, "label": "token"},
    
    {"source": "POD", "target": "POST", "color": ACCENT_PINK, "label": "post-exploit"},
    {"source": "POD", "target": "NODE", "color": ACCENT_ROSE, "label": "escape"},
]

# ==========================================
# 2. Rendering Functions
# ==========================================

def draw_grid(draw):
    """Draws background grid dots."""
    for x in range(0, WIDTH, 24):
        for y in range(0, HEIGHT, 24):
            draw.ellipse([x-1, y-1, x+1, y+1], fill=GRID_COLOR)

def draw_card(draw, node):
    """Draws a glassy custom node card with a glowing accent top line and bold vector typography."""
    x, y, w, h = node["x"], node["y"], node["width"], node["height"]
    glow_color = node["color"]
    
    # Draw K8s Cluster bounding box (group)
    if node.get("isGroup"):
        border_col = (glow_color[0], glow_color[1], glow_color[2], 90)
        draw.rectangle([x, y, x+w, y+h], outline=border_col, width=2)
        draw.text((x + w//2, y + 24), "KUBERNETES CLUSTER", fill=(glow_color[0], glow_color[1], glow_color[2], 255), anchor="mm", font=FONT_HEADER)
        return

    # Draw regular card
    # Glassy background
    draw.rectangle([x, y, x+w, y+h], fill=CARD_BG)
    
    # Glowing top accent line
    draw.rectangle([x, y, x+w, y+4], fill=glow_color)
    
    # Card borders
    draw.rectangle([x, y, x+w, y+h], outline=(255, 255, 255, 24), width=1)
    
    # Badge text (Bold, Large)
    draw.text((x + 16, y + 14), node["badge"], fill=(148, 163, 184, 180), font=FONT_BADGE)
    
    # Title text (Bold, Large)
    draw.text((x + 16, y + 32), node["title"], fill=(255, 255, 255, 255), font=FONT_TITLE)
    
    # Description text wrapping
    words = node["desc"].split()
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        if draw.textlength(test_line, font=FONT_DESC) < w - 32:
            current_line.append(word)
        else:
            lines.append(" ".join(current_line))
            current_line = [word]
    if current_line:
        lines.append(" ".join(current_line))
        
    dy = 60
    for line in lines[:2]:
        draw.text((x + 16, y + dy), line, fill=(148, 163, 184, 200), font=FONT_DESC)
        dy += 19

def draw_flowing_edge(draw, edge, t_offset):
    """Draws a connecting edge with continuous glowing particle flows."""
    src = next(n for n in nodes if n["id"] == edge["source"])
    tgt = next(n for n in nodes if n["id"] == edge["target"])
    
    # Check if vertical / stepped flow
    is_vertical = edge["source"] == "POD" and edge["target"] == "NODE"
    
    if is_vertical:
        x1, y1 = src["x"] + src["width"]//2, src["y"] + src["height"]
        x2, y2 = tgt["x"] + tgt["width"]//2, tgt["y"]
    else:
        x1, y1 = src["x"] + src["width"], src["y"] + src["height"]//2
        x2, y2 = tgt["x"], tgt["y"] + tgt["height"]//2
        
    # 1. Draw static background connector vector line
    draw.line([(x1, y1), (x2, y2)], fill=(edge["color"][0], edge["color"][1], edge["color"][2], 80), width=2)
    
    # 2. Draw terminal arrow head
    if is_vertical:
        draw.polygon([(x2-5, y2-5), (x2+5, y2-5), (x2, y2)], fill=(edge["color"][0], edge["color"][1], edge["color"][2], 200))
    else:
        draw.polygon([(x2-6, y2-4), (x2-6, y2+4), (x2, y2)], fill=(edge["color"][0], edge["color"][1], edge["color"][2], 200))
        
    # 3. Draw flowing neon particles along the path
    particle_spacings = [0.0, 0.33, 0.66] if not is_vertical else [0.0, 0.5]
    for spacing in particle_spacings:
        t = (t_offset + spacing) % 1.0
        
        # Compute particle position
        px = x1 + (x2 - x1) * t
        py = y1 + (y2 - y1) * t
        
        # Soft outer pulse glow
        draw.ellipse([px-7, py-7, px+7, py+7], fill=(edge["color"][0], edge["color"][1], edge["color"][2], 90))
        # Solid center core
        draw.ellipse([px-3, py-3, px+3, py+3], fill=(255, 255, 255, 255))
        
    # 4. Optional text label (statically rendered for clean contrast)
    if "label" in edge:
        label_x = x1 + (x2 - x1) * 0.4
        label_y = y1 + (y2 - y1) * 0.4 - 12 if not is_vertical else y1 + (y2 - y1) * 0.5
        draw.text((label_x, label_y), edge["label"], fill=(255, 255, 255, 180), font=FONT_BADGE)

# ==========================================
# 3. Main Generator Loop
# ==========================================

def make_frame(t_offset):
    """Renders a single looping frame using PIL drawing primitives."""
    img = Image.new("RGBA", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Draw backdrop
    draw_grid(draw)
    
    # Draw active flow paths
    for edge in edges:
        draw_flowing_edge(draw, edge, t_offset)
        
    # Draw active custom nodes
    for node in nodes:
        draw_card(draw, node)
        
    return img

def main():
    print("Generating looping final state flowchart frames...")
    frames = []
    
    # 32 frames for smooth, faster 12 FPS loop cycle (total 2.6s)
    num_frames = 32
    for i in range(num_frames):
        t_offset = i / num_frames
        frame_img = make_frame(t_offset)
        
        # Merge with black background to flatten RGBA to RGB
        rgb_frame = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
        rgb_frame.paste(frame_img, mask=frame_img.split()[3])
        frames.append(rgb_frame)
        
    gif_path = "/Users/nguyenthanhtan/devel/office/edr-workflow/workflow.gif"
    print(f"Frames rendered. Compiling looping GIF...")
    imageio.mimsave(gif_path, frames, duration=0.08, loop=0)  # ~12 FPS
    print(f"Looping GIF successfully updated at: {gif_path}")

if __name__ == "__main__":
    main()
