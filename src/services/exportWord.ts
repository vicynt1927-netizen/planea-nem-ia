import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
} from 'docx';
import { DidacticPlan, TeacherProfile } from '../types';

export async function exportPlanToWord(plan: DidacticPlan, profile?: TeacherProfile): Promise<void> {
  const primaryColor = '1E3A8A'; // Blue 900
  const headerBg = 'F1F5F9'; // Slate 100
  const accentColor = '0D9488'; // Teal 600

  const cellBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
  };

  // Header rows table
  const generalTableRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Escuela:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: profile?.escuela || 'Escuela Primaria', size: 20 })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Docente titular:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: profile?.nombre || 'Docente de Grupo', size: 20 })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'CCT / Turno:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${profile?.cct || 'N/D'} | Turno: ${profile?.turno || 'Matutino'} | Ciclo: ${profile?.cicloEscolar || '2026-2027'}`,
                  size: 20,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Fase / Grado / Grupo:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${plan.fase} | Grado: ${plan.grado} | Grupo: ${plan.grupo} | Temporalidad: ${plan.temporalidad}`,
                  size: 20,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Campo Formativo:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: plan.campoFormativo, bold: true, size: 20, color: primaryColor })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Metodología NEM:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: plan.metodologia, size: 20 })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Ejes Articuladores:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: plan.ejesArticuladores.join(', ') || 'No especificados', size: 20 })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Contenido oficial:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: plan.contenido, size: 20 })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'PDA (Proceso de Desarrollo):', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: plan.pda, size: 20 })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Propósito didáctico:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: plan.proposito, size: 20 })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Problemática / Contexto:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${plan.problematica || 'No indicada'}\nSituación: ${plan.situacionContexto || 'No indicada'}`,
                  size: 20,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: headerBg },
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Producto final del proyecto:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [new TextRun({ text: plan.productoFinal, bold: true, size: 20, color: accentColor })],
            }),
          ],
        }),
      ],
    }),
  ];

  // Sessions tables
  const sessionChildren: (Paragraph | Table)[] = [];

  plan.sesiones.forEach((s) => {
    sessionChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `Sesión ${s.numero}: ${s.momento}`,
            bold: true,
            size: 22,
            color: primaryColor,
          }),
        ],
      })
    );

    const sessionTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Propósito de la sesión:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: s.proposito, size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Tiempo y Organización:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: `${s.tiempo} | Organización: ${s.organizacion}`, size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'INICIO:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: s.inicio, size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'DESARROLLO:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: s.desarrollo, size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'CIERRE:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: s.cierre, size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Actividades Docente:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: s.actividadesDocente || 'N/A', size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Actividades Alumno:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: s.actividadesAlumno || 'N/A', size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Materiales:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: s.materiales?.join(', ') || 'Cuaderno y útiles escolares', size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Producto / Evidencia:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: s.productoEvidencia, size: 19, bold: true })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Evaluación e Instrumento:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: `${s.evaluacion} | Instrumento: ${s.instrumento}`, size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: headerBg },
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: 'Adecuaciones curriculares:', bold: true, size: 19 })] })],
            }),
            new TableCell({
              borders: cellBorder,
              children: [new Paragraph({ children: [new TextRun({ text: s.adecuaciones || 'Atención personalizada según BAP.', size: 19 })] })],
            }),
          ],
        }),
      ],
    });

    sessionChildren.push(sessionTable);
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'SECRETARÍA DE EDUCACIÓN PÚBLICA',
                bold: true,
                size: 24,
                color: '475569',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'PLAN DIDÁCTICO - NUEVA ESCUELA MEXICANA',
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `PROYECTO: "${plan.titulo.toUpperCase()}"`,
                bold: true,
                size: 24,
                color: accentColor,
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 100, after: 100 },
            children: [new TextRun({ text: 'I. DATOS GENERALES Y ELEMENTOS CURRICULARES', bold: true, size: 22 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: generalTableRows,
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [new TextRun({ text: 'II. SECUENCIA DIDÁCTICA DE SESIONES', bold: true, size: 22 })],
          }),
          ...sessionChildren,
          new Paragraph({
            spacing: { before: 400 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '__________________________________                __________________________________\n',
                size: 20,
              }),
              new TextRun({
                text: `Docente de Grupo: ${profile?.nombre || 'Docente Titular'}                      Vo. Bo. Dirección Escolar`,
                bold: true,
                size: 20,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = plan.titulo.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  const filename = `planeacion_${safeTitle || 'didactica'}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
