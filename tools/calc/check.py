# Comprobaciones de la especificacion v1.0 (python3 -I). Deriva de calc_v08/check.py (v0.9 + B-5c en v1.0).
import math
M=1e6
# ---------- 8.2 / 6.12: estadio, demanda, asistencia ----------
aforo=42800; R=60
om={'gen':(18000,.95),'pref':(14000,.80),'fondo':(9000,.90),'palcos':(1200,.95),'vip':(600,.95)}
cap=sum(p*o for p,o in om.values()); omg=cap/aforo
fr=0.70+0.006*R; fa=0.90+0.002*60; fans=aforo*0.6; ff=min(1.10,max(0.90,1+0.20*(fans/aforo-0.5)))
dem=0.80*aforo*fr*fa*ff
asis=round(min(aforo*omg,dem))
print('cap',cap,'omg %.6f'%omg,'dem %.2f'%dem,'asis',asis,'ocup %.4f'%(asis/aforo),'umbral %.4f'%(cap/(0.8*aforo)))
pab=min(0.70,max(0.40,0.60+0.003*(R-60)))
abon=round(aforo*pab); abas=round(abon*0.85)
# palcos (6.2.3) y B-5e: plazas de palco vendidas fuera de la taquilla
tasa=min(0.95,max(0.5,0.5+0.004*R+0.05)); npal=round(120*tasa); plazas_palco=10*npal
tv=max(0,asis-abas-plazas_palco); taq=tv*45
tv_v08=asis-abas; taq_v08=tv_v08*45
print('abonos',abon,'abas',abas,'palcos',npal,'plazas palco',plazas_palco,'tv',tv,'taq',taq,'| v0.8 tv',tv_v08,taq_v08,'dif temporada',(taq_v08-taq)*19)
# ---------- B-5b precio de taquilla (f_precio, epsilon 1,2) ----------
def taq_precio(p):
    d=0.80*aforo*fr*fa*ff*(p/45)**(-1.2); a=round(min(aforo*omg,d)); return max(0,a-abas-plazas_palco)*p, a
for p in (22.5,40.5,45,50,90): print('precio',p,'taq,asis',taq_precio(p))
# ---------- Pools v0.9 (F-1, F-2) ----------
AV=1432.12; NAC=990.0; INT=AV-NAC
AV1=0.9*AV; AV2=0.1*AV
COM=1584.5; COM1=0.9*COM; COM2=0.1*COM
DIG1=40.0; DIG2=4.0
base_umbral=AV+COM+DIG1+DIG2
Ldisp=3.5 if base_umbral>=1500 else 4.5
print('AV int',round(INT,2),'AV1',round(AV1,3),'AV2',round(AV2,3),'COM1',round(COM1,3),'COM2',round(COM2,3),'base umbral',round(base_umbral,2),'Ldisp',Ldisp)
print('2027/28 AV',1050+INT,'base',1050+INT+COM+44,'Ldisp',3.5 if 1050+INT+COM+44>=1500 else 4.5)
# escala legal de resultados (art. 5.3.b.1, Primera) en %
esc=[17,15,13,11,9,7,5,3.5,3,2.75]+[2.75-0.25*k for k in range(1,11)]
print('escala',esc,'suma',sum(esc),'n',len(esc))
w5=[0.35,0.20,0.15,0.15,0.15]; print('pesos 5 temporadas',sum(w5))
def cuota_primera(pos,impl): # fraccion del pool
    return 0.5/20+0.25*esc[pos-1]/100+0.25*impl
f10=cuota_primera(10,1/20)
print('fraccion club ref (pos 10, impl 1/20)',f10)
av_ref=AV1*f10; dig_ref=DIG1*f10; com_ref=COM1*f10
print('ref AV %.4f dig %.4f com %.4f derechos(AV+dig) %.4f'%(av_ref,dig_ref,com_ref,av_ref+dig_ref))
print('ref 1/20: AV %.4f dig %.4f com %.4f'%(AV1/20,DIG1/20,COM1/20))
print('tramo AV mensual %.6f; digital mensual %.6f; com semestral %.6f'%(av_ref/10,dig_ref/12,com_ref/2))
# dispersion: liga ilustrativa (posicion p, implantacion 1/20) y caso extremo
sh=[cuota_primera(p,1/20) for p in range(1,21)]; print('liga ilustrativa max/min',max(sh)/min(sh),'suma',sum(sh))
ext=0.025+0.25*0.17+0.25*0.15, 0.025+0.25*0.0025+0.25*0.02; print('extremo (impl 15 % / 2 %)',ext,ext[0]/ext[1])
# procedimiento de clamp (6.9.2) con brutos proporcionales a 1..20 y pool AV1
def clampfit(b,pool,K):
    lo,hi=0.0,pool/len(b)
    for _ in range(200):
        L=(lo+hi)/2; s=sum(min(max(x,L),K*L) for x in b)
        if s<pool: lo=L
        else: hi=L
    return L
b=[AV1*i/210 for i in range(1,21)]
L=clampfit(b,AV1,Ldisp); r=[min(max(x,L),Ldisp*L) for x in b]
print('clamp AV1: L %.4f KL %.4f'%(L,Ldisp*L),'n en L',sum(1 for x in b if x<=L),'n en KL',sum(1 for x in b if x>=Ldisp*L),'suma %.4f'%sum(r))
for i in range(20): pass
print('repartos clamp',[round(x,4) for x in r])
# ---------- Segunda (6.9.3 v0.9): fondo 2,5 %, 70 % igual, 15 % resultados, 15 % implantacion ----------
def segunda(pool,fondo=True,impl=None):
    f=0.025*pool if fondo else 0.0; resto=pool-f
    ig=0.70*resto; res=0.15*resto; imp=0.15*resto
    w=[2-1.5*(p-1)/21 for p in range(1,23)]; sw=sum(w)
    impl=impl or [1/22]*22
    out=[ig/22+res*w[i]/sw+imp*impl[i] for i in range(22)]
    return f,resto,ig,res,imp,sw,out
f,resto,ig,res,imp,sw,out=segunda(AV2)
print('Segunda AV: pool %.3f fondo %.4f resto %.4f igual %.4f (club %.5f) res %.4f impl %.4f sw %.2f'%(AV2,f,resto,ig,ig/22,res,imp,sw))
print('  1.o %.4f 22.o %.4f suma+fondo %.4f max/min %.3f'%(out[0],out[-1],sum(out)+f,out[0]/out[-1]))
wp=[2-1.5*(p-1)/19 for p in (18,19,20)]; print('  fondo descendidos',[round(f*x/sum(wp),4) for x in wp])
print('  sin descendidos (2026/27): 1.o %.4f 22.o %.4f'%(segunda(AV2,False)[6][0],segunda(AV2,False)[6][-1]))
fc,_,_,_,_,_,oc=segunda(COM2,False); print('Segunda COM: 1.o %.4f 22.o %.4f media %.4f'%(oc[0],oc[-1],COM2/22))
_,_,_,_,_,_,od=segunda(DIG2,False); print('Segunda DIG: 1.o %.4f 22.o %.4f'%(od[0],od[-1]))
# ---------- Matchday temporada ----------
pal=npal*3000*19; hosp=round(500*tasa)*150*19
rest_p=asis*8*0.40*0.30; rest=rest_p*19
abo=abon*600; taqT=taq*19
md=taqT+abo+pal+hosp+rest
print('palcos',pal,'hosp',hosp,'rest_p',rest_p,'rest',rest,'abonos',abo,'taqT',taqT,'MD %.2f'%md)
# ---------- Merchandising ----------
tf=19*asis*0.15*0.12*35
mults=[1.3,1.2,1.0,1.0,1.0,1.3,0.9,0.8,0.8,0.8,0.8,0.8]; sm=sum(mults)
seg=aforo*0.6+R*8000
on=seg*1.2*0.012*48*sm; cam=seg*0.30*60*0.12
# B-5c (v1.0): tienda fisica fuera de dia de partido = visitas de museo y tours x 0,04 x 35 EUR
vis_museo=90000*fr*1.0; vis_tour=min(50,round(aforo/1000))*300
tfuera=(vis_museo+vis_tour)*0.04*35
mm=[1.4,1.4,1,1,1,0.7,0.7,1,1,1,1,1]  # julio a junio (8.4)
assert abs(sum(mm)-12.2)<1e-9
tf_mes=[round((vis_museo+vis_tour)*m/12.2*0.04*35,2) for m in mm]
print('B-5c junio absorbe %.2f'%(round(tfuera,2)-sum(tf_mes[:11])-tf_mes[11]))
print('B-5c visitas museo %.0f tours %.0f tienda fuera anual %.2f julio %.2f septiembre %.2f diciembre %.2f suma meses %.2f'%(vis_museo,vis_tour,tfuera,tf_mes[0],tf_mes[2],tf_mes[5],sum(tf_mes)))
merch=tf+on+cam+tfuera
merch_cambio=tf+on+cam*1.5+tfuera
print('seg',seg,'tf %.0f on %.0f cam %.0f tfuera %.0f tot %.0f cambio %.0f'%(tf,on,cam,tfuera,merch,merch_cambio))
# ---------- Patrocinio B-5a ----------
mult=0.52+0.008*R; print('mult patrocinio R60',mult,'patrocinio',23*mult,'naming',12*mult,'rango',0.52,0.52+0.8)
# ---------- Otros ----------
mus=90000*fr*1.0*15*0.85; tours=min(50,round(aforo/1000))*12*300
prem=[6,4,4,4,2.5,2.5,2.5,2.5,2.5,2.5,1.2,1.2,1.2,1.2,1.2,1.2,0.6,0.3,0.3,0.3]
prem10=prem[9]
otros=(mus+tours)/M+prem10
print('museo',mus,'tours',tours,'premio pos10',prem10,'premio medio',sum(prem)/20,'otros %.5f'%otros)
# ---------- 14.8 ----------
anch={'derechos':av_ref+dig_ref,'comercializacion':com_ref,'patrocinio':23*mult,'naming':12*mult,'vallas':(aforo//40)*18000/M}
rows=dict(anch); rows['matchday']=md/M; rows['merch']=merch/M; rows['otros']=otros
T=sum(rows.values())
print('anclas %.4f'%sum(anch.values()),'base sin otros %.4f'%(T-otros),'T %.4f'%T)
for k,v in rows.items(): print('  %-16s %9.4f  %6.2f %%'%(k,v,100*v/T))
print('  merch cambio equip %.2f %% total cambio %.4f'%(100*merch_cambio/M/(T+0.5*cam/M),T+0.5*cam/M))
print('  matchday filas: taq %.2f abonos %.2f palcos %.2f hosp %.2f rest %.2f'%(taqT/M,abo/M,pal/M,hosp/M,rest/M))
# alternativa con premio medio y club 1/20 (informativo)
T20=AV1/20+DIG1/20+COM1/20+23+12+19.26+md/M+merch/M+(mus+tours)/M+sum(prem)/20
print('informativo club 1/20 con premio medio: T %.4f'%T20)
# ---------- 6.12 saldo de agosto ----------
s=15+av_ref/10+dig_ref/12+2.3-5.0-8/12-2.568/12+taq/M
rows612=[15,round(av_ref/10,2),round(dig_ref/12,2),2.3,-5.0,-0.67,-0.21,round(taq/M,2)]
print('saldo agosto exacto %.6f'%s,'filas redondeadas',rows612,'suma %.2f'%sum(rows612))
print('saldo agosto en euros %.2f'%(s*M))
# ---------- 15.2 recaudacion historica ----------
rec=5*(19*taq+abo); print('recaudacion historica 5 temporadas',rec,'por temporada',19*taq+abo)
# ---------- 10.1 / 23.8 INCN ----------
incn=av_ref+dig_ref+com_ref+taqT/M; masa=60+8+1.2*(0.5+0.55)
print('INCN %.4f masa %.2f ratio %.4f'%(incn,masa,masa/incn))
print('limite inversion 1,5 x INCN %.3f'%(1.5*incn))
# ---------- Segunda ocupacion (14.4, criterio 6) ----------
a2=18000; R2=40; d2=0.65*a2*(0.70+0.006*R2)*(0.90+0.002*60)*min(1.10,max(0.90,1+0.20*(0.6-0.5)))
print('Segunda R40 demanda %.1f ocupacion %.4f'%(d2,d2/a2))
# ---------- B-6 eventos ----------
def ev(af,pr,can,pc,ft=1.0):
    de=0.85*af*fr*ft; ll=min(omg,de/af); return can+pc*af*ll*pr, ll
for n,(af,pr,can,pc,ft) in {'c1':(25000,50,0.5e6,0.15,1.0),'c2':(40000,80,1.5e6,0.15,1.0),'c3':(60000,100,3.0e6,0.15,1.0),'corp':(6000,0,0.15e6,0,0.8),'nofut':(10000,30,0.2e6,0.10,0.8)}.items():
    print('evento',n,'%.0f llenado %.4f'%ev(af,pr,can,pc,ft))
print('8.6.3 con 0,8904:',1.5e6+0.15*40000*0.8904*80)
# aparcamiento B-6b
print('aparcamiento club ref por partido',min(1500,round(0.10*asis))*10,'temporada',min(1500,round(0.10*asis))*10*19)
# bloqueo ampliacion B-6a
print('bloqueo 10 % general',round(0.10*18000),'reforma 25 %',round(0.25*aforo))
# ---------- B-7a generador ----------
print('caja inicial R60',0.25*60,'Segunda R40',0.05*40,'personal Primera',6*0.5+2+3,'Segunda',4*0.15+0.4+0.5)
# ---------- B-1 margenes ----------
for a in range(0,7): print('anios',a,'compra min',min(1.3,0.8+0.1*a),'venta sistema',min(1.0,0.6+0.1*a))
# ---------- Sin cambio desde v0.8 ----------
nv=aforo//40; print('vallas',nv,nv*18000, round(18000/19,2),round(6000/21,2))
P=10e6;t=0.05;n=60;i=t/12
cf=P*i*(1+i)**n/((1+i)**n-1); print('francesa cuota %.2f interes %.2f'%(cf,cf*n-P))
lin_p=P/n; print('lineal cuota1 %.2f int total %.2f'%(lin_p+P*i,sum((P-lin_p*k)*i for k in range(n))))
print('tipo R60',0.06-0.02*60/100)
import random
random.seed(1); N=200000; d=[3+math.floor(147*random.random()**3) for _ in range(N)]
print('lesion media %.2f >56 %.4f >120 %.4f mediana %d'%(sum(d)/N,sum(x>56 for x in d)/N,sum(x>120 for x in d)/N,sorted(d)[N//2]))
ws=[0.9**(k-1) for k in range(1,31)]; print('share>=5 %.4f'%(sum(ws[4:])/sum(ws)))
print('honorarios P R55',1.2*(0.5+0.55))
# B-3 condicion fisica titular en semana con partido (desgaste -2)
for plan,rec in (('suave',3),('normal',2),('intenso',1)): print('B-3',plan,'titular',rec-2,'no titular',rec)
# B-2 pesos
print('pesos 3 obj',[x/0.8 for x in (0.4,0.2,0.2)],'Coach 2 obj',[x/0.6 for x in (0.4,0.2)])

# ---------- precisiones en euros para el checklist ----------
print('clamp L eur %.2f KL eur %.2f'%(L*M,Ldisp*L*M))
f,resto,ig,res,imp,sw,out=segunda(AV2)
print('Segunda eur: fondo %.2f igual club %.2f 1.o %.2f 22.o %.2f'%(f*M,ig/22*M,out[0]*M,out[-1]*M))
print('fondo eur',[round(f*x/sum(wp)*M,2) for x in wp])
o0=segunda(AV2,False)[6]; print('2026/27 sin fondo eur 1.o %.2f 22.o %.2f'%(o0[0]*M,o0[-1]*M))
print('ref eur: AV %.2f dig %.2f com %.2f tramoAV %.2f dig mes %.2f com tramo %.2f'%(av_ref*M,dig_ref*M,com_ref*M,av_ref*M/10,dig_ref*M/12,com_ref*M/2))
# optimo de precio con tope de asistencia
pt=45*(cap/dem)**(-1/1.2); print('precio en el que la demanda toca el tope %.2f taq %.0f'%(pt,(cap-abas-plazas_palco)*pt))
print('rango 14.8 sumas min',26+28+9+4+4+7+2+0.5,'max',32+33+18+11+6+9+3+4)
# ---------- B-6a bloqueo de ampliacion (general 18.000) ----------
def partido_con_bloqueo(bloq):
    disp=aforo-bloq; d=0.80*disp*fr*fa*ff; a=round(min(disp*omg,d)); return a, max(0,a-abas-plazas_palco)*45
for bl in (0,1800,18000): print('bloqueo',bl,'tope',round((aforo-bl)*omg),'asis,taq',partido_con_bloqueo(bl),'perdida/partido',taq-partido_con_bloqueo(bl)[1])
# ---------- mayor resto (4.1) para el fondo y cuotas ----------
def mayor_resto(vals_eur,total_cent):
    c=[v*100 for v in vals_eur]; base=[math.floor(x) for x in c]; falta=total_cent-sum(base)
    orden=sorted(range(len(c)),key=lambda i:-(c[i]-base[i]))
    for i in orden[:falta]: base[i]+=1
    return [b/100 for b in base]
fv=[f*x/sum(wp)*M for x in wp]; print('fondo mayor resto',mayor_resto(fv,round(f*M*100)))
print('digital 11 cuotas',round(dig_ref*M/12,2),'ultima',round(dig_ref*M-11*round(dig_ref*M/12,2),2))
print('AV tramo',av_ref*M/10)

# ---------- A-26 (v1.0): filas de 14.8 dentro de los rangos aceptados ----------
rng={'derechos':(26,32),'comercializacion':(28,33),'matchday':(9,18),'patrocinio':(4,11),'naming':(4,6),'vallas':(7,9),'merch':(2,3),'otros':(0.5,4)}
ok=all(rng[k][0]<=100*v/T<=rng[k][1] for k,v in rows.items()) and 2<=100*merch_cambio/M/(T+0.5*cam/M)<=3 and abs(T-221)<=1
print('A-26 filas en rango y total 221 +-1:',ok); assert ok
